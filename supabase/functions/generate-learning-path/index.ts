import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentId, topic } = await req.json();

    if (!studentId || !topic) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch student's recent submissions and progress
    const { data: submissions } = await supabase
      .from('test_submissions')
      .select('*, questions(topic, difficulty)')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })
      .limit(10);

    const { data: progress } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', studentId)
      .eq('topic', topic)
      .maybeSingle();

    // Prepare context for AI
    const context = {
      currentTopic: topic,
      currentSkillLevel: progress?.skill_level || 0,
      recentSubmissions: submissions?.map(s => ({
        topic: s.questions?.topic,
        difficulty: s.questions?.difficulty,
        score: s.score,
        analysis: s.ai_analysis
      })) || []
    };

    const systemPrompt = `You are an expert educational AI that creates personalized learning paths for programming students. 
Based on the student's performance data, generate a comprehensive learning path with:
1. Current skill assessment (0-100)
2. 3-5 specific strengths
3. 3-5 areas for improvement
4. 3-5 recommended next topics in order of priority
5. A clear next milestone to achieve

Be specific, actionable, and encouraging.`;

    const userPrompt = `Create a personalized learning path for a student studying ${topic}.
Current skill level: ${context.currentSkillLevel}%
Recent performance: ${JSON.stringify(context.recentSubmissions, null, 2)}

Provide a structured response with strengths, areas for improvement, recommended topics, and next milestone.`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'create_learning_path',
            description: 'Create a structured learning path for the student',
            parameters: {
              type: 'object',
              properties: {
                skill_level: { 
                  type: 'number',
                  description: 'Assessed skill level from 0-100'
                },
                strengths: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of student strengths'
                },
                areas_for_improvement: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Areas where student needs improvement'
                },
                recommended_topics: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Next topics to study in priority order'
                },
                next_milestone: {
                  type: 'string',
                  description: 'Clear next goal to achieve'
                }
              },
              required: ['skill_level', 'strengths', 'areas_for_improvement', 'recommended_topics', 'next_milestone'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'create_learning_path' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const learningPathData = JSON.parse(toolCall.function.arguments);

    // Save to database
    const { error: upsertError } = await supabase
      .from('learning_paths')
      .upsert({
        student_id: studentId,
        current_topic: topic,
        skill_level: learningPathData.skill_level,
        strengths: learningPathData.strengths,
        areas_for_improvement: learningPathData.areas_for_improvement,
        recommended_topics: learningPathData.recommended_topics,
        next_milestone: learningPathData.next_milestone,
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Database error:', upsertError);
      throw upsertError;
    }

    return new Response(
      JSON.stringify(learningPathData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-learning-path:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
