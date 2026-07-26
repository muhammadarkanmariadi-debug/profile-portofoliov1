import { NextResponse } from 'next/server';
import { syncGithubRepos } from '@/lib/services/github-sync.service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request: Request) {
  return await handleSync(request);
}

export async function GET(request: Request) {
  return await handleSync(request);
}

async function handleSync(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncGithubRepos();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: 'Sync failed', details: error.message }, { status: 500 });
  }
}
