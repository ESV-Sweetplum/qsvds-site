/*
  Warnings:

  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_pkey";
ALTER TABLE "Rating" RENAME COLUMN "id" TO "rating_id";
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("rating_id");
