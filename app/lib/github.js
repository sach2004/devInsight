import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  dangerouslyAllowBrowser: true
  
});

export async function getRepositoryContent(owner, repo, path = '') {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (!Array.isArray(data)) {
      throw new Error('Expected array of contents');
    }

    const contents = await Promise.all(
      data.map(async (item) => {
        const content = {
          name: item.name,
          path: item.path,
          type: item.type,
        };

        if (item.type === 'dir') {
          content.children = await getRepositoryContent(owner, repo, item.path);
        } else if (item.type === 'file') {
          const fileData = await octokit.repos.getContent({
            owner,
            repo,
            path: item.path,
          });
          
          if ('content' in fileData.data) {
            content.content = Buffer.from(fileData.data.content, 'base64').toString();
          }
        }

        return content;
      })
    );

    return contents;
  } catch (error) {
    console.error('Error fetching repository content:', error);
    throw error;
  }
}