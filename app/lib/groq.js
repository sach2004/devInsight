// import Groq from "groq-sdk";

// const groq = new Groq({
//   apiKey: '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',
//    dangerouslyAllowBrowser: true
// });

// export async function generateDocumentation(files) {
//   const fileContents = files
//     .map((file) => `File: ${file.path}\n\n${file.content}`)
//     .join('\n\n');

//   const prompt = `
//     Analyze the following repository contents and generate comprehensive documentation including:
//     - Project overview
//     - Setup instructions
//     - Key features
//     - Architecture
//     - Dependencies
    
//     Repository contents:
//     ${fileContents}
//   `;

//   const completion = await groq.chat.completions.create({
//     messages: [{ role: "user", content: prompt }],
//     model: "mixtral-8x7b-32768",
//     temperature: 0.7,
//     max_tokens: 2048,
//   });

//   return completion.choices[0]?.message?.content || '';
// }

// export async function generateDocker(files) {
//   const packageJson = files.find(f => f.path === 'package.json')?.content || '';
  
//   const prompt = `
//     Generate a Dockerfile for a Node.js application with the following package.json:
//     ${packageJson}
    
//     Include best practices for:
//     - Multi-stage builds
//     - Security
//     - Performance
//     - Development and production environments
//   `;

//   const completion = await groq.chat.completions.create({
//     messages: [{ role: "user", content: prompt }],
//     model: "mixtral-8x7b-32768",
//     temperature: 0.7,
//     max_tokens: 1024,
//   });

//   return completion.choices[0]?.message?.content || '';
// }



// import { NextResponse } from 'next/server';
// import Groq from "groq-sdk";
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
//   dangerouslyAllowBrowser: true
// });

// export async function POST(request) {
//   try {
//     const { query, documentedCode, messageHistory } = await request.json();
    
//     if (!query) {
//       return NextResponse.json(
//         { error: 'Query is required' },
//         { status: 400 }
//       );
//     }
    
//     if (!documentedCode || documentedCode.length === 0) {
//       return NextResponse.json(
//         { error: 'No documented code available' },
//         { status: 400 }
//       );
//     }
    
//     // Get only the relevant files and functions based on the query
//     const relevantCode = extractRelevantCode(query, documentedCode);
    
//     // Build system message with compact context
//     const systemMessage = buildSystemMessage(relevantCode);
    
//     // Build conversation history
//     const messages = [
//       {
//         role: "system", 
//         content: systemMessage
//       }
//     ];
    
//     // Add only the last few messages to avoid token limits
//     const recentMessages = messageHistory?.slice(-5) || [];
//     messages.push(...recentMessages);
    
//     // Get response from Groq
//     const completion = await groq.chat.completions.create({
//       messages,
//       model: "mixtral-8x7b-32768",
//       temperature: 0.3,
//       max_tokens: 100024,
//     });
    
//     const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
//     return NextResponse.json({ response });
    
//   } catch (error) {
//     console.error('Error in chat API:', error);
//     return NextResponse.json(
//       { error: error.message || 'Something went wrong' },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * Extracts code that seems relevant to the query to reduce context size
//  * 
//  */
// export async function generateDocumentation(files) {
//   const fileContents = files
//     .map((file) => `File: ${file.path}\n\n${file.content}`)
//     .join('\n\n');

//   const prompt = `
//     Analyze the following repository contents and generate comprehensive documentation including:
//     - Project overview
//     - Setup instructions
//     - Key features
//     - Architecture
//     - Dependencies
    
//     Repository contents:
//     ${fileContents}
//   `;

//   const completion = await groq.chat.completions.create({
//     messages: [{ role: "user", content: prompt }],
//     model: "mixtral-8x7b-32768",
//     temperature: 0.7,
//     max_tokens: 2048,
//   });

//   return completion.choices[0]?.message?.content || '';
// } 

// function extractRelevantCode(query, documentedCode) {
//   // Convert query to lowercase for case-insensitive matching
//   const queryTerms = query.toLowerCase().split(/\s+/);
  
//   if (Array.isArray(documentedCode)) {
//     // Extract relevant files and functions
//     const relevantFiles = [];
    
//     for (const file of documentedCode) {
//       // Check if file path matches any query term
//       const isPathRelevant = queryTerms.some(term => 
//         file.path.toLowerCase().includes(term)
//       );
      
//       // Check if functions match any query term
//       const relevantFunctions = file.functions?.filter(func =>
//         queryTerms.some(term => func.toLowerCase().includes(term))
//       );
      
//       if (isPathRelevant || relevantFunctions?.length > 0) {
//         // File is relevant, include it
//         relevantFiles.push(file);
//       }
//     }
    
//     // If no relevant files found, include first file as fallback (or first 3 files if many)
//     if (relevantFiles.length === 0 && documentedCode.length > 0) {
//       return documentedCode.slice(0, Math.min(3, documentedCode.length));
//     }
    
//     return relevantFiles;
//   } 
  
//   // If it's just a string, return it directly
//   return documentedCode;
// }

// /**
//  * Builds a concise system message with the relevant code context
//  */
// function buildSystemMessage(relevantCode) {
//   let contextText = '';
  
//   if (Array.isArray(relevantCode)) {
//     // Limit to max 3 files to avoid token issues
//     const filesToInclude = relevantCode.slice(0, 3);
    
//     contextText = filesToInclude.map(file => {
//       // For each file, extract only function signatures and their documentation
//       // rather than the full implementation
//       const documentedContent = extractFunctionSignaturesAndDocs(file.documentedContent);
      
//       return `
// File: ${file.path}
// Functions: ${file.functions?.join(', ') || 'None'}
// ${documentedContent}`;
//     }).join('\n\n');
//   } else if (typeof relevantCode === 'string') {
//     contextText = extractFunctionSignaturesAndDocs(relevantCode);
//   }
  
//   return `You are a helpful code assistant that answers questions about the user's codebase.
// Here is the relevant documented code you can reference:
// ${contextText}

// If asked about code details not included above, you can say you don't have all the implementation details.
// Answer questions specifically based on this codebase. If you don't know or the answer isn't in the code provided, say so.
// Keep answers concise and relevant to the code.`;
// }

// /**
//  * Extracts function signatures and their documentation comments
//  * while skipping full implementations to save tokens
//  */
// function extractFunctionSignaturesAndDocs(codeContent) {
//   if (!codeContent) return '';
  
//   // Simple regex to capture JS/TS function or method signatures with preceding comments
//   const pattern = /(\/\*\*[\s\S]*?\*\/\s*)?((async\s+)?function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>|class\s+\w+|export\s+(default\s+)?((async\s+)?function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>))/g;
  
//   const matches = [...codeContent.matchAll(pattern)];
//   if (matches.length === 0) {
//     // If no matches, return a shortened version (first 500 chars) of the content
//     return codeContent.substring(0, 500) + (codeContent.length > 500 ? '...' : '');
//   }
  
//   // Extract the signatures with their docs
//   return matches.map(match => {
//     const docComment = match[1] || '';
//     const signature = match[2] || '';
//     return `${docComment}${signature} {...}`;
//   }).join('\n\n');
// }



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
    
   
    const relevantCode = extractRelevantCode(query, documentedCode);
    
  
    const systemMessage = buildSystemMessage(relevantCode);
    
    
    const messages = [
      {
        role: "system", 
        content: systemMessage
      }
    ];
    
  
    const recentMessages = messageHistory?.slice(-2) || [];
    messages.push(...recentMessages);
    

    const tokenLimitedMessages = enforceTokenLimit(messages);
    
 
    const completion = await groq.chat.completions.create({
      messages: tokenLimitedMessages,
      model: "mixtral-8x7b-32768",
      temperature: 0.3,
      max_tokens: 2048,
    });
    
    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    

    if (error.message?.includes('rate_limit_exceeded') || error.message?.includes('tokens per minute')) {
      return NextResponse.json(
        { error: 'Request exceeded token limits. Please try a shorter query or wait a moment before trying again.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}



export async function generateDocumentation(files) {
  try {

    const limitedFiles = files.slice(0, 10);
    

    const fileContents = limitedFiles
      .map((file) => `File: ${file.path}\n\n${file.content.substring(0, 500)}${file.content.length > 500 ? '...' : ''}`)
      .join('\n\n');

    const prompt = `
      Analyze the following repository contents and generate concise documentation including:
      - Project overview
      - Key features
      - Architecture
      
      Repository contents (truncated for brevity):
      ${fileContents}
    `;

    const estimatedTokens = estimateTokenCount(prompt);
    const truncatedPrompt = estimatedTokens > 4000 
      ? prompt.substring(0, 16000) 
      : prompt;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: truncatedPrompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating documentation:', error);
    return 'Failed to generate documentation due to API limitations.';
  }
}


function extractRelevantCode(query, documentedCode) {
 
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  if (!Array.isArray(documentedCode)) {
  
    return typeof documentedCode === 'string' 
      ? documentedCode.substring(0, 2000) 
      : documentedCode;
  }
  

  const scoredFiles = documentedCode.map(file => {
    let score = 0;
    

    queryTerms.forEach(term => {
      if (file.path.toLowerCase().includes(term)) score += 3;
    });
    
   
    file.functions?.forEach(func => {
      queryTerms.forEach(term => {
        if (func.toLowerCase().includes(term)) score += 2;
      });
    });
    
    return { file, score };
  });
  

  scoredFiles.sort((a, b) => b.score - a.score);
  

  const relevantFiles = scoredFiles
    .filter(item => item.score > 0)
    .slice(0, 2)
    .map(item => item.file);
  
 
  if (relevantFiles.length === 0 && documentedCode.length > 0) {
    return [documentedCode[0]];
  }
  
  return relevantFiles;
}


function buildSystemMessage(relevantCode) {
  let contextText = '';
  
  if (Array.isArray(relevantCode)) {
    contextText = relevantCode.map(file => {
   
      const documentedContent = extractFunctionSignaturesAndDocs(file.documentedContent);
      
      return `
File: ${file.path}
Functions: ${(file.functions || []).slice(0, 5).join(', ')}${file.functions?.length > 5 ? '...' : ''}
${documentedContent}`;
    }).join('\n\n');
  } else if (typeof relevantCode === 'string') {
    contextText = extractFunctionSignaturesAndDocs(relevantCode);
  }
  
  const systemMsg = `You are a code assistant. Analyze this code:
${contextText}

Answer questions based only on this code. Be concise.`;

  
  if (estimateTokenCount(systemMsg) > 3000) {
    return systemMsg.substring(0, 12000); 
  }
  
  return systemMsg;
}


function extractFunctionSignaturesAndDocs(codeContent) {
  if (!codeContent) return '';
  

  const pattern = /(\/\*\*[\s\S]*?\*\/\s*)?((async\s+)?function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>|class\s+\w+|export\s+(default\s+)?((async\s+)?function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*=>))/g;
  
  const matches = [...(codeContent.matchAll(pattern) || [])];
  if (matches.length === 0) {
   
    return codeContent.substring(0, 400) + (codeContent.length > 400 ? '...' : '');
  }
  

  return matches.slice(0, 6).map(match => {
    const docComment = match[1] || '';
    const signature = match[2] || '';
    return `${docComment}${signature} {...}`;
  }).join('\n\n');
}


function estimateTokenCount(text) {
  if (!text) return 0;
 
  return Math.ceil(text.length / 4);
}


function enforceTokenLimit(messages, maxTokens = 4000) {
  let totalTokens = 0;
  const limitedMessages = [];
  
  
  if (messages[0]?.role === "system") {
    const systemTokens = estimateTokenCount(messages[0].content);
    if (systemTokens > maxTokens * 0.6) {
    
      messages[0].content = messages[0].content.substring(0, Math.floor(maxTokens * 0.6 * 4));
    }
    limitedMessages.push(messages[0]);
    totalTokens += estimateTokenCount(messages[0].content);
  }
  

  for (let i = messages.length - 1; i >= 1; i--) {
    const msgTokens = estimateTokenCount(messages[i].content);
    
  
    if (totalTokens + msgTokens > maxTokens * 0.8) {
      break;
    }
    
    limitedMessages.unshift(messages[i]);
    totalTokens += msgTokens;
  }
  
  return limitedMessages;
}