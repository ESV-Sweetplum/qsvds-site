/*
  Warnings:

  - Added the required column `map_quaver_id` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "map_quaver_id" INTEGER NOT NULL;

ALTER SEQUENCE "User_id_seq" RESTART WITH 1;

ALTER SEQUENCE "Map_id_seq" RESTART WITH 1;

ALTER SEQUENCE "Rating_id_seq" RESTART WITH 1;
