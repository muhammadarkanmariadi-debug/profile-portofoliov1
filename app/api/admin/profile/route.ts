import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { profileSchema } from '@/lib/validations/profile';

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json(profile || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const existingProfile = await prisma.profile.findFirst();

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: validatedData,
      });
    } else {
      profile = await prisma.profile.create({
        data: validatedData,
      });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
