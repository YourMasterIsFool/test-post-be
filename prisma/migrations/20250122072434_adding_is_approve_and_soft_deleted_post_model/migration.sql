-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isApprove" BOOLEAN NOT NULL DEFAULT true;
