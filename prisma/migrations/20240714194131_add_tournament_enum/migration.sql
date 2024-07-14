-- CreateEnum
CREATE TYPE "Tournament" AS ENUM ('QOT1', 'QOT2', 'QOT3', 'QOT4', 'ESVT1', 'ESVT2');

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "inTournaments" "Tournament"[] DEFAULT ARRAY[]::"Tournament"[];
