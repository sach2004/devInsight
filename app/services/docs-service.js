import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateDocumentation(functionContext, model = "mixtral-8x7b-32768") {
  const prompt = `
    Generate comprehensive documentation for the following function.
    Include:
    - Description of what the function does
    - Parameters with types and descriptions
    - Return value with type and description
    - Example usage if applicable
    - Any exceptions that might be thrown

    Function:
    ${functionContext.code}
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model,
      temperature: 0.3,
      max_tokens: 1024,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error(`Error generating documentation:`, error);
    return `// Failed to generate documentation: ${error.message}`;
  }
}