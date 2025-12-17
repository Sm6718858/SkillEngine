import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const improveCodeWithAI = async ({ code, language }) => {
  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
You are a PRINCIPAL ${language} SOFTWARE ENGINEER.

YOUR TASK:
You must deeply analyze and rewrite the given code as a senior developer.

MANDATORY RULES (NO EXCEPTIONS):
1. Always improve code structure and readability
2. Convert one-line logic into clean multi-line code
3. Use best possible time & space efficient approach
4. Add clear comments explaining WHY, not just WHAT
5. ALWAYS add:
   - Time Complexity
   - Space Complexity
6. Handle edge cases where applicable
7. Use meaningful variable and function names
8. Never return the original code as-is
9. Output ONLY valid ${language} code (no markdown, no explanation)

Think like this code will be reviewed in a FAANG interview.
          `,
        },
        {
          role: "user",
          content: `
Rewrite and optimize the following code:

${code}
          `,
        },
      ],
    });

    const improved = chat.choices[0].message.content.trim();

    return improved || code;
  } catch (err) {
    console.error("Groq error:", err.message);
    return code;
  }
};
