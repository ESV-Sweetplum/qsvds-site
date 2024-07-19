/*
  Warnings:

  - A unique constraint covering the columns `[user_id,map_id]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_user_id_map_id_key" ON "Rating"("user_id", "map_id");
