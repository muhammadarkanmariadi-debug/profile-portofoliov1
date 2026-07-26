export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  language: string;
  pushed_at: string;
}

export async function fetchRepos(username: string, token?: string): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers,
      next: { revalidate: 0 }, // prevent Next.js from aggressively caching this
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.statusText}`);
  }

  // Log rate limit remaining for observability
  const remaining = response.headers.get('x-ratelimit-remaining');
  console.log(`GitHub API rate limit remaining: ${remaining}`);

  return response.json();
}

export async function fetchReadme(fullName: string, token?: string): Promise<string | null> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.raw+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${fullName}/readme`,
    {
      headers,
      next: { revalidate: 0 }, // prevent caching
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch README for ${fullName}: ${response.statusText}`);
  }

  return response.text();
}
