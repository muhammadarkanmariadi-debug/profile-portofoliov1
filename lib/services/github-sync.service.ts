import { prisma } from '@/lib/prisma';
import { fetchRepos, fetchReadme } from '@/lib/github';

export async function syncGithubRepos() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    throw new Error('GITHUB_USERNAME is not configured');
  }

  const skipForks = process.env.SKIP_FORKS === 'true';
  const skipArchived = process.env.SKIP_ARCHIVED === 'true';
  const overwriteDescription = process.env.OVERWRITE_DESCRIPTION_ON_SYNC === 'true';

  const syncLog = await prisma.syncLog.create({
    data: {
      status: 'started',
    },
  });

  let reposSynced = 0;
  const errors: string[] = [];

  try {
    const repos = await fetchRepos(username, token);

    for (const repo of repos) {
      if (skipForks && repo.fork) continue;
      if (skipArchived && repo.archived) continue;

      try {
        const readmeContent = await fetchReadme(repo.full_name, token);

        // Optional delay to prevent secondary rate limits if large amount of repos
        await new Promise(resolve => setTimeout(resolve, 200));

        const existingProject = await prisma.project.findUnique({
          where: { githubId: repo.id },
        });

        if (!existingProject) {
          // New record
          await prisma.project.create({
            data: {
              githubId: repo.id,
              githubFullName: repo.full_name,
              readmeContent: readmeContent,
              primaryLanguage: repo.language,
              starsCount: repo.stargazers_count,
              isFork: repo.fork,
              isArchived: repo.archived,
              pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
              lastSyncedAt: new Date(),
              syncSource: 'github',
              // Initial Values
              title: repo.name,
              category: 'Open Source Repository',
              description: repo.description || 'Open source software engineering repository and architecture.',
              sourceCodeUrl: repo.html_url,
            },
          });
          reposSynced++;
        } else {
          // Update existing record
          const updateData: any = {
            githubFullName: repo.full_name,
            readmeContent: readmeContent,
            primaryLanguage: repo.language,
            starsCount: repo.stargazers_count,
            isFork: repo.fork,
            isArchived: repo.archived,
            pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
            lastSyncedAt: new Date(),
            sourceCodeUrl: repo.html_url,
          };

          if (overwriteDescription && repo.description) {
            updateData.description = repo.description;
          }

          await prisma.project.update({
            where: { githubId: repo.id },
            data: updateData,
          });
          reposSynced++;
        }
      } catch (err: any) {
        console.error(`Failed to sync repo ${repo.full_name}:`, err);
        errors.push(`repo: ${repo.full_name}, error: ${err.message}`);
      }
    }

    const finalStatus = errors.length > 0 ? (reposSynced > 0 ? 'partial' : 'failed') : 'success';

    // Invalidate Redis Cache if any repositories were created or updated
    if (reposSynced > 0) {
      const { invalidateProjectsCache } = await import('@/lib/services/project.service');
      await invalidateProjectsCache();
    }

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        finishedAt: new Date(),
        status: finalStatus,
        reposSynced,
        errorMessage: errors.length > 0 ? JSON.stringify(errors) : null,
      },
    });

    return {
      success: finalStatus !== 'failed',
      reposSynced,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('Sync process failed:', error);
    
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        finishedAt: new Date(),
        status: 'failed',
        errorMessage: error.message,
      },
    });

    throw error;
  }
}
