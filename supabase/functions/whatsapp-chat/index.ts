import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are RideAI, an intelligent WhatsApp assistant for booking rides (like Uber).

Your capabilities:
- Book rides by understanding natural language requests
- Support multiple languages (English, Hindi, Kannada, Tamil)
- Extract pickup and dropoff locations from user messages
- Suggest ride types: economy (₹5 base), comfort (₹8 base), premium (₹15 base)
- Calculate estimated fares based on distance
- Provide friendly, conversational responses

When user requests a ride:
1. Extract pickup and dropoff locations
2. Calculate rough distance estimate
3. Show fare estimates for all ride types
4. Ask for confirmation with buttons

Example interactions:
User: "Find me a cab from Indiranagar to Airport"
You: "🚕 Found rides from Indiranagar to Bangalore Airport:
• Economy: ₹240 (2-5 min away)
• Comfort: ₹320 (3-7 min away)
• Premium: ₹450 (5-10 min away)

Which ride would you like to book?"

User: "Book economy"
You: "✅ Booking Economy ride...
Driver assigned: Rajesh Kumar
Vehicle: KA01AB1234
ETA: 3 minutes
Track your ride live!"

Always be helpful, friendly, and efficient. If unsure about locations, ask for clarification.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationHistory: [...messages.slice(1), { role: 'assistant', content: aiResponse }]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});