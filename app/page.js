'use client';

import { useState } from 'react';
import { getRepositoryContent } from './lib/github';
import { generateDocumentation } from './lib/groq';
import RepoViewer from './components/RepoViewer';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [docs, setDocs] = useState('');
  const [docker, setDocker] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
  
      const url = new URL(repoUrl);
      const [, owner, repo] = url.pathname.split('/');

      if (!owner || !repo) {
        throw new Error('Invalid repository URL');
      }

      const data = await getRepositoryContent(owner, repo);
      setRepoData(data);

 
      const files = data.filter(f => f.type === 'file').map(f => ({
        path: f.path,
        content: f.content || ''
      }));
      
      const documentation = await generateDocumentation(files);
      setDocs(documentation);

   
      const dockerfile = await generateDocker(data);
      setDocker(dockerfile);

    } catch (error) {
      console.error('Error:', error);
      setError('Error analyzing repository. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Developer Assistant</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Repository'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {repoData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <RepoViewer data={repoData} />
          </div>
          <div className="space-y-8">
            {docs && (
              <div className="border rounded-lg p-4 bg-white">
                <h2 className="text-xl font-semibold mb-4">Documentation</h2>
                <div className="prose max-w-none">
                  <ReactMarkdown>{docs}</ReactMarkdown>
                </div>
              </div>
            )}
            {docker && (
              <div className="border rounded-lg p-4 bg-white">
                <h2 className="text-xl font-semibold mb-4">Generated Dockerfile</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  {docker}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}