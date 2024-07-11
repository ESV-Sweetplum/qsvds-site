/*
  Warnings:

  - A unique constraint covering the columns `[quaver_id]` on the table `Map` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quaver_id` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "quaver_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Map_quaver_id_key" ON "Map"("quaver_id");
