// 'use client';

// import { useState } from 'react';
// import RepoViewer from '../RepoViewer';

// export default function DocumentRepo() {
//   const [owner, setOwner] = useState('');
//   const [repo, setRepo] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [result, setResult] = useState(null);
//   const [processedFiles, setProcessedFiles] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setResult(null);
//     setProcessedFiles([]);
    
//     try {
//       const response = await fetch('/api/document-repo', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ owner, repo }),
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to document repository');
//       }
      
//       setResult(data);
//       setProcessedFiles(data.files || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Document GitHub Repository</h1>
      
//       <form onSubmit={handleSubmit} className="mb-6">
//         <div className="flex gap-4 mb-4">
//           <div className="flex-1">
//             <label htmlFor="owner" className="block mb-2 font-medium">
//               Repository Owner:
//             </label>
//             <input
//               id="owner"
//               type="text"
//               value={owner}
//               onChange={(e) => setOwner(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               placeholder="e.g., facebook"
//               required
//             />
//           </div>
          
//           <div className="flex-1">
//             <label htmlFor="repo" className="block mb-2 font-medium">
//               Repository Name:
//             </label>
//             <input
//               id="repo"
//               type="text"
//               value={repo}
//               onChange={(e) => setRepo(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               placeholder="e.g., react"
//               required
//             />
//           </div>
//         </div>
        
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {isLoading ? 'Processing...' : 'Document Repository'}
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
//           <p className="mt-2">
//             Processed {processedFiles.length} files
//           </p>
//         </div>
//       )}
      
//       {processedFiles.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Processed Files</h2>
          
//           {processedFiles.map((file, index) => (
//             <div key={index} className="mb-6 border border-gray-200 rounded-md overflow-hidden">
//               <div className="bg-gray-100 px-4 py-2 font-medium">
//                 {file.path}
//               </div>
//               <div className="p-4">
//                 <p className="mb-2">
//                   Documented functions: {file.functions.join(', ')}
//                 </p>
                
//                 <details>
//                   <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
//                     View Documented Code
//                   </summary>
//                   <pre className="mt-2 p-3 bg-gray-100 rounded-md overflow-x-auto font-mono text-sm">
//                     {file.documentedContent}
//                   </pre>
//                 </details>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import AIChatAssistant from '../AIChatAssistant';

export default function DocumentRepo() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [showChatAssistant, setShowChatAssistant] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);
    setProcessedFiles([]);
    setShowChatAssistant(false);
    
    try {
      const response = await fetch('/api/document-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner, repo }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to document repository');
      }
      
      setResult(data);
      setProcessedFiles(data.files || []);
      
     
      if (data.files && data.files.length > 0) {
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
      <h1 className="text-2xl font-bold text-center mb-5 ">DevInsight</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="owner" className="block mb-2 font-medium">
              Repository Owner:
            </label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              placeholder="e.g., facebook"
              required
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="repo" className="block mb-2 font-medium">
              Repository Name:
            </label>
            <input
              id="repo"
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              placeholder="e.g., react"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Document Repository'}
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
          <p className="mt-2">
            Processed {processedFiles.length} files
          </p>
        </div>
      )}
      
      {processedFiles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Processed Files</h2>
          
          {processedFiles.map((file, index) => (
            <div key={index} className="mb-6 border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-medium text-black">
                {file.path}
              </div>
              <div className="p-4">
                <p className="mb-2">
                  Documented functions: {file.functions.join(', ')}
                </p>
                
                <details>
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    View Documented Code
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded-md overflow-x-auto font-mono text-sm text-black">
                    {file.documentedContent}
                  </pre>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
      
  
      <AIChatAssistant 
        documentedCode={processedFiles} 
        isActive={showChatAssistant} 
      />
    </div>
  );
}