-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Player', 'Contributor', 'Administrator');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Player';
