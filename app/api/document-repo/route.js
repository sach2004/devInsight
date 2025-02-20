
import { NextResponse } from 'next/server';
import { getRepositoryContent } from '../../services/github-service';
import { processRepositoryContent } from '../../services/repo-processor';

export async function POST(request) {
  try {
    const { owner, repo, model } = await request.json();
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Repository owner and name are required' },
        { status: 400 }
      );
    }

    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    try {
      const repoContent = await getRepositoryContent(owner, repo);
      
      if (!repoContent || repoContent.length === 0) {
        return NextResponse.json(
          { message: 'No compatible files found in repository' },
          { status: 200 }
        );
      }

      const processedFiles = await processRepositoryContent(repoContent, model);
      
      if (processedFiles.length === 0) {
        return NextResponse.json(
          { message: 'No functions found to document in compatible files' },
          { status: 200 }
        );
      }

      return NextResponse.json({
        message: `Successfully processed repository ${owner}/${repo}`,
        files: processedFiles
      });

    } catch (error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error in document-repo API:', error);
    const status = error.status || 500;
    const message = error.message || 'An unexpected error occurred';
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}