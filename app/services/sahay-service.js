import { generateDocumentation } from './docs-service';


export function parseFunctionInfo(functionsData) {
  return functionsData.map(func => {
    return {
      name: func.name,
      code: func.code,
      startLine: func.startLine || 0,
      filePath: func.filePath || '',
    };
  });
}


export async function documentFunctions(functionsData, model = "mixtral-8x7b-32768") {
  const functionInfos = parseFunctionInfo(functionsData);
  const results = [];

  for (const funcInfo of functionInfos) {
    console.log(`Generating documentation for: ${funcInfo.name}`);
    const documentation = await generateDocumentation(funcInfo, model);
    
    results.push({
      ...funcInfo,
      documentation
    });
  }

  return results;
}


export function extractFunctionsFromContent(fileContent, filePath) {


  const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;
  const matches = [...fileContent.matchAll(functionRegex)];
  
  const functions = matches.map(match => {
    const name = match[1];
    const startIndex = match.index;
    const startLine = fileContent.substring(0, startIndex).split('\n').length - 1;
    

    const codeLines = fileContent.split('\n');
    const contextStart = Math.max(0, startLine - 3);
    const contextEnd = Math.min(codeLines.length, startLine + 25);
    const code = codeLines.slice(contextStart, contextEnd).join('\n');
    
    return {
      name,
      code,
      startLine,
      filePath
    };
  });
  
  return functions;
}

export function applyDocumentationToContent(fileContent, documentedFunctions) {
  const lines = fileContent.split('\n');
  
  documentedFunctions.sort((a, b) => b.startLine - a.startLine);
  
  for (const func of documentedFunctions) {

    lines.splice(func.startLine, 0, func.documentation);
  }
  
  return lines.join('\n');
}