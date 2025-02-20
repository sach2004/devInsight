'use client';

// import { useState } from 'react';

// export default function DocumentCode() {
//   const [code, setCode] = useState('');
//   const [documentedCode, setDocumentedCode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [result, setResult] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch('/api/document', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           fileContent: code,
//           filePath: 'input.js'
//         }),
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to document code');
//       }
      
//       setDocumentedCode(data.documented);
//       setResult(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Document Your Code</h1>
      
//       <form onSubmit={handleSubmit} className="mb-6">
//         <div className="mb-4">
//           <label htmlFor="code" className="block mb-2 font-medium">
//             Paste your code here:
//           </label>
//           <textarea
//             id="code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono"
//             placeholder="function example() { ... }"
//             required
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {isLoading ? 'Documenting...' : 'Generate Documentation'}
//         </button>
//       </form>
      
//       {error && (
//         <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-md">
//           {error}
//         </div>
//       )}
      
//       {result && (
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Result</h2>
//           <p>{result.message}</p>
//           {result.functions && result.functions.length > 0 && (
//             <p className="mt-2">
//               Documented functions: {result.functions.map(f => f.name).join(', ')}
//             </p>
//           )}
//         </div>
//       )}
      
//       {documentedCode && (
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Documented Code</h2>
//           <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto font-mono text-sm">
//             {documentedCode}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState } from 'react';
import AIChatAssistant from '../AIChatAssistant';

export default function DocumentCode() {
  const [code, setCode] = useState('');
  const [documentedCode, setDocumentedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showChatAssistant, setShowChatAssistant] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowChatAssistant(false);
    
    try {
      const response = await fetch('/api/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileContent: code,
          filePath: 'input.js'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to document code');
      }
      
      setDocumentedCode(data.documented);
      setResult(data);
      
      // Enable chat assistant after successful documentation
      if (data.documented) {
        setShowChatAssistant(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Your Code</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="code" className="block mb-2 font-medium">
            Paste your code here:
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono"
            placeholder="function example() { ... }"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Documenting...' : 'Generate Documentation'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <p>{result.message}</p>
          {result.functions && result.functions.length > 0 && (
            <p className="mt-2">
              Documented functions: {result.functions.map(f => f.name).join(', ')}
            </p>
          )}
        </div>
      )}
      
      {documentedCode && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Documented Code</h2>
          <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto font-mono text-sm">
            {documentedCode}
          </pre>
        </div>
      )}
      
      {/* Chat Assistant */}
      <AIChatAssistant 
        documentedCode={documentedCode} 
        isActive={showChatAssistant} 
      />
    </div>
  );
}