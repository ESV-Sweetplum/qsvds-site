/*
  Warnings:

  - The primary key for the `Map` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `map` on the `Map` table. All the data in the column will be lost.
  - Added the required column `mapQua` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_map_id_fkey";

-- AlterTable
ALTER TABLE "Map" DROP CONSTRAINT "Map_pkey";
ALTER TABLE "Map" RENAME COLUMN "id" TO "map_id";
ALTER TABLE "Map" RENAME COLUMN "map" TO "mapQua";
ALTER TABLE "Map" ADD CONSTRAINT "Map_pkey" PRIMARY KEY ("map_id");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "Map"("map_id") ON DELETE RESTRICT ON UPDATE CASCADE;
