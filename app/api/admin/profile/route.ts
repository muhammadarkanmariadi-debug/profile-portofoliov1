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

    const profileData = {
      ...validatedData,
      shortDescriptionId: validatedData.shortDescriptionId ?? validatedData.shortDescriptionEn,
      fullBiographyId: validatedData.fullBiographyId ?? validatedData.fullBiographyEn,
    };

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: profileData,
      });
    } else {
      profile = await prisma.profile.create({
        data: profileData,
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
