import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq({
  domain,
  tone, 
  conversation,
  answer,
}) {
  const systemPrompt =
    tone === "strict"
      ? `You are a very strict technical interviewer.
         - Be concise
         - Point out mistakes
         - Ask challenging follow-up questions
         - No motivation or praise`
      : `You are a friendly interviewer.
         - Encourage the candidate
         - Give short hints if stuck
         - Ask one clear question at a time`;

  const userPrompt = `
Interview Domain: ${domain}

Conversation so far:
${conversation}

Candidate just answered:
"${answer}"

Respond as interviewer:
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: tone === "strict" ? 0.4 : 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return completion.choices[0].message.content;
}
