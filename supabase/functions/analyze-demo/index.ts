import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputType, inputContent, programmingLanguage } = await req.json();

    console.log("Demo analysis request:", { inputType, inputContent: inputContent.substring(0, 100) });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create appropriate system prompt based on input type
    let systemPrompt = "";
    let userPrompt = "";

    if (inputType === "code") {
      systemPrompt = `You are an expert programming tutor analyzing student code submissions. Provide constructive, educational feedback that helps students learn.`;
      userPrompt = `Analyze this ${programmingLanguage || "programming"} code and provide detailed feedback covering:
1. Code correctness and functionality
2. Best practices and code quality
3. Efficiency and optimization opportunities
4. Learning suggestions for improvement

Code to analyze:
\`\`\`
${inputContent}
\`\`\``;
    } else {
      systemPrompt = `You are an expert educational tutor analyzing student explanations of programming concepts. Provide constructive feedback that helps students improve their understanding.`;
      userPrompt = `Analyze this student's explanation and provide detailed feedback covering:
1. Conceptual accuracy and understanding
2. Clarity and completeness of explanation
3. Any misconceptions or gaps in knowledge
4. Suggestions for deeper learning

Student's explanation:
"${inputContent}"`;
    }

    // Call Lovable AI Gateway
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
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (aiResponse.status === 402) {
        throw new Error("AI credits exhausted. Please add credits to continue.");
      }
      
      throw new Error("Failed to generate AI feedback");
    }

    const aiData = await aiResponse.json();
    const feedback = aiData.choices[0].message.content;

    console.log("Demo analysis completed successfully");

    return new Response(
      JSON.stringify({ feedback }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error in analyze-demo:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
