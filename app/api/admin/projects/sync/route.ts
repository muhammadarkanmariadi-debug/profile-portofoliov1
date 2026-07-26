import { NextResponse } from 'next/server';
import { syncGithubRepos } from '@/lib/services/github-sync.service';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const result = await syncGithubRepos();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: 'Sync failed', details: error.message }, { status: 500 });
  }
}
