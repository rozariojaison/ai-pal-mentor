import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputType, inputContent, programmingLanguage } = await req.json();
    
    // Get auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing input for user:", user.id);

    // Store interaction
    const { data: interaction, error: interactionError } = await supabase
      .from("student_interactions")
      .insert({
        user_id: user.id,
        input_type: inputType,
        input_content: inputContent,
        programming_language: programmingLanguage,
      })
      .select()
      .single();

    if (interactionError) {
      console.error("Error storing interaction:", interactionError);
      return new Response(
        JSON.stringify({ error: "Failed to store interaction" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare AI prompt
    const systemPrompt = `You are AI-PAL, an adaptive learning assistant for programming education. 
Your role is to analyze student submissions and provide personalized, educational feedback without giving away complete solutions.

Analyze the student's ${inputType === "code" ? "code" : "explanation"} and provide:
1. Clarity Analysis (score 0-100 and detailed analysis)
2. Conceptual Understanding (what they understand well and gaps to address)
3. ${inputType === "code" ? "Code Quality (efficiency, best practices, suggestions)" : ""}
4. Misconception Detection (identify any incorrect understanding)
5. Adaptive Hint (guide them toward the solution without revealing it)
6. Suggested Next Topic (what they should study next)

Focus on being encouraging, educational, and progressive in your feedback.`;

    const userPrompt = `${inputType === "code" ? `Programming Language: ${programmingLanguage}\n\nCode:\n` : "Explanation:\n"}${inputContent}`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const feedbackText = aiData.choices[0].message.content;

    // Parse feedback (basic parsing, could be enhanced with structured output)
    const clarityMatch = feedbackText.match(/clarity.*?(\d+)/i);
    const clarityScore = clarityMatch ? parseInt(clarityMatch[1]) : 75;

    // Store analysis result
    const { error: resultError } = await supabase
      .from("analysis_results")
      .insert({
        interaction_id: interaction.id,
        user_id: user.id,
        clarity_score: clarityScore,
        clarity_analysis: feedbackText.substring(0, 500),
        conceptual_understanding: feedbackText.substring(500, 1000),
        adaptive_hint: "Review the fundamental concepts and try again.",
        suggested_next_topic: "Consider exploring related topics.",
      });

    if (resultError) {
      console.error("Error storing results:", resultError);
    }

    // Return structured feedback
    return new Response(
      JSON.stringify({
        interactionId: interaction.id,
        feedback: feedbackText,
        clarityScore,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-input:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
