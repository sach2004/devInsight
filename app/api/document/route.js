import { NextResponse } from 'next/server';
import { extractFunctionsFromContent, documentFunctions, applyDocumentationToContent } from '../../services/sahay-service';

export async function POST(request) {
  try {
    const { fileContent, filePath, model } = await request.json();
    
    if (!fileContent) {
      return NextResponse.json(
        { error: 'File content is required' },
        { status: 400 }
      );
    }
    
  
    const functions = extractFunctionsFromContent(fileContent, filePath || 'unnamed.js');
    
    if (functions.length === 0) {
      return NextResponse.json(
        { message: 'No functions found to document', documented: fileContent },
        { status: 200 }
      );
    }
    
  
    const documentedFunctions = await documentFunctions(functions, model || 'mixtral-8x7b-32768');
    
  
    const documentedContent = applyDocumentationToContent(fileContent, documentedFunctions);
    
    return NextResponse.json({
      message: `Successfully documented ${documentedFunctions.length} functions`,
      documented: documentedContent,
      functions: documentedFunctions
    });
    
  } catch (error) {
    console.error('Error in document API:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}