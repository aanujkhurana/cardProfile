export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  const body = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: body.model || "gpt-3.5-turbo",
      messages: body.messages,
      max_tokens: body.max_tokens || 500,
      temperature: body.temperature ?? 0.7,
    })
  });

  const data = await openaiRes.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
