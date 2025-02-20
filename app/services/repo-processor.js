
import { 
    extractFunctionsFromContent, 
    documentFunctions, 
    applyDocumentationToContent 
  } from './sahay-service';
  
  export async function processRepositoryContent(contents, model, processed = []) {
    if (!Array.isArray(contents)) {
      return processed;
    }
  
    for (const item of contents) {
      if (item.type === 'file' && item.content) {
       
        const isJsFile = item.name.endsWith('.js') || 
                        item.name.endsWith('.jsx') ||
                        item.name.endsWith('.ts') || 
                        item.name.endsWith('.tsx');
  
        if (isJsFile) {
          try {
            const functions = extractFunctionsFromContent(item.content, item.path);
            
            if (functions.length > 0) {
              const documentedFunctions = await documentFunctions(functions, model);
              const documentedContent = applyDocumentationToContent(
                item.content, 
                documentedFunctions
              );
              
              processed.push({
                path: item.path,
                originalContent: item.content,
                documentedContent,
                functions: documentedFunctions.map(f => f.name)
              });
            }
          } catch (error) {
            console.error(`Error processing file ${item.path}:`, error);
          }
        }
      } else if (item.type === 'dir' && item.children) {
        await processRepositoryContent(item.children, model, processed);
      }
    }
  
    return processed;
  }