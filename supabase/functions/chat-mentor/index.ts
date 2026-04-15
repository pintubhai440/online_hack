import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      return new Response(JSON.stringify({ response: null, error: "No OpenAI key configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are VidyaAI Mentor, an expert AI advisor helping Indian students plan their study abroad journey. You specialize in:
- Graduate university admissions (MS, MBA, PhD) in USA, UK, Canada, Australia, Germany, Singapore
- GRE/GMAT/IELTS/TOEFL requirements and strategies
- SOP and LOR guidance
- Education loan options from Indian NBFCs (HDFC Credila, Avanse, InCred, SBI)
- Visa processes (F-1, UK Student, Canadian Study Permit)
- Post-graduation work rights (OPT/CPT, PGWP, PSW)
- Scholarships and financial aid
- ROI analysis of studying abroad vs staying in India

User context: ${context?.targetField ? `studying ${context.targetField}` : 'exploring options'}, interested in: ${context?.targetCountries?.join(', ') || 'multiple countries'}.

Be concise, practical, and specific. Use bullet points where helpful. Provide actionable advice. If mentioning loan amounts, convert to INR (1 USD = 83.5 INR). Always be encouraging but realistic.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ response: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || null;

    return new Response(JSON.stringify({ response: reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ response: null, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
