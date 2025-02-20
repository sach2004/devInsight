
import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function POST(request) {
  try {
    const { query, documentedCode, messageHistory } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    if (!documentedCode || documentedCode.length === 0) {
      return NextResponse.json(
        { error: 'No documented code available' },
        { status: 400 }
      );
    }
    
  
    let codeContext = '';
    
    if (Array.isArray(documentedCode)) {
   
      codeContext = documentedCode.map(file => {
        return `
File: ${file.path}
${file.documentedContent}
        `;
      }).join('\n\n');
    } else if (typeof documentedCode === 'string') {
      codeContext = documentedCode;
    }
    
   
    const messages = [
      {
        role: "system", 
        content: `You are a helpful code assistant that answers questions about the user's codebase.
Here is the documented code you can reference:

${codeContext}

Answer questions specifically based on this codebase. If you don't know or the answer isn't in the code provided, say so.
Keep answers concise and relevant to the code.`
      }
    ];
    
  
    const recentMessages = messageHistory?.slice(-10) || [];
    messages.push(...recentMessages);
    

    const completion = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768", 
      temperature: 0.3,
      max_tokens: 1024,
    });
    
    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}