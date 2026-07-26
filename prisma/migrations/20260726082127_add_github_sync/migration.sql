-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubFullName" TEXT,
ADD COLUMN     "githubId" INTEGER,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFork" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "primaryLanguage" TEXT,
ADD COLUMN     "pushedAt" TIMESTAMP(3),
ADD COLUMN     "readmeContent" TEXT,
ADD COLUMN     "starsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "syncSource" TEXT NOT NULL DEFAULT 'manual';

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "reposSynced" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);
