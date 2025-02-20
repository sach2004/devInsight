import { Octokit } from '@octokit/rest';


const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    timeout: 10000, 
    retries: 3,     
  }
});


const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

function parseRepoInput(repoInput) {
  try {
    if (repoInput.includes('github.com')) {
      const url = new URL(repoInput);
      const pathParts = url.pathname.split('/').filter(Boolean);
      return pathParts[1];
    }
    return repoInput;
  } catch (error) {
    throw new Error(`Invalid repository format: ${repoInput}`);
  }
}

function isSupportedFile(filename) {
  return SUPPORTED_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext));
}

export async function getRepositoryContent(owner, repo, path = '') {
  try {
    const repoName = parseRepoInput(repo);
    
   
    try {
      await octokit.repos.get({
        owner,
        repo: repoName
      });
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`Repository not found: ${owner}/${repoName}`);
      } else if (error.status === 403) {
        throw new Error('GitHub API rate limit exceeded or invalid token. Please check your GitHub token.');
      }
      throw error;
    }


    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path,
      });

    
      if (!Array.isArray(data)) {
        if (data.type === 'file' && isSupportedFile(data.name)) {
          try {
            return [{
              name: data.name,
              path: data.path,
              type: data.type,
              content: Buffer.from(data.content, 'base64').toString()
            }];
          } catch (error) {
            console.warn(`Skipping file ${data.path} due to encoding error`);
            return [];
          }
        }
        return [];
      }


      const contents = await Promise.all(
        data.map(async (item) => {
   
          if (item.type === 'file' && !isSupportedFile(item.name)) {
            return null;
          }

          const content = {
            name: item.name,
            path: item.path,
            type: item.type,
          };

          try {
            if (item.type === 'dir') {
              content.children = await getRepositoryContent(owner, repoName, item.path);
            } else if (item.type === 'file') {
              const fileData = await octokit.repos.getContent({
                owner,
                repo: repoName,
                path: item.path,
              });

              if ('content' in fileData.data) {
                content.content = Buffer.from(fileData.data.content, 'base64').toString();
              }
            }
            return content;
          } catch (error) {
            console.warn(`Skipping ${item.path} due to error:`, error.message);
            return null;
          }
        })
      );

   
      return contents.filter(item => 
        item !== null && 
        (item.type === 'file' || (item.type === 'dir' && item.children?.length > 0))
      );

    } catch (error) {
      if (error.status === 403) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in getRepositoryContent:', error);
    throw new Error(error.message || 'Failed to fetch repository content');
  }
}