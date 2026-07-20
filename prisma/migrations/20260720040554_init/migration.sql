-- CreateEnum
CREATE TYPE "TimelineType" AS ENUM ('EDUCATION', 'EXPERIENCE');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE_ORM', 'BAHASA_LAINNYA', 'VERSION_CONTROL', 'CLOUD_DEPLOYMENT', 'DESIGN_PROTOTYPING', 'SISTEM_OPERASI');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "githubUrl" TEXT,
    "twitterUrl" TEXT,
    "lanyardImageUrl" TEXT,
    "shortDescriptionEn" TEXT,
    "shortDescriptionId" TEXT,
    "fullBiographyEn" TEXT,
    "fullBiographyId" TEXT,
    "cvFileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEntry" (
    "id" TEXT NOT NULL,
    "type" "TimelineType" NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "logoUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionId" TEXT,
    "roleEn" TEXT,
    "roleId" TEXT,
    "isDeploy" BOOLEAN NOT NULL DEFAULT false,
    "liveUrl" TEXT,
    "sourceCodeUrl" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "statusEn" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectSkills_B_index" ON "_ProjectSkills"("B");

-- AddForeignKey
ALTER TABLE "_ProjectSkills" ADD CONSTRAINT "_ProjectSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectSkills" ADD CONSTRAINT "_ProjectSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
