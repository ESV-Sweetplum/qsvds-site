/*
  Warnings:

  - A unique constraint covering the columns `[quaver_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_quaver_id_key" ON "User"("quaver_id");
