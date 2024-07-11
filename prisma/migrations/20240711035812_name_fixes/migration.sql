/*
  Warnings:

  - You are about to drop the column `submittedById` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `mapId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `quaverId` on the `User` table. All the data in the column will be lost.
  - Added the required column `submittedBy_id` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `map_id` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quaver_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Map" DROP CONSTRAINT "Map_submittedById_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_mapId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_userId_fkey";

-- DropIndex
DROP INDEX "User_quaverId_key";

-- AlterTable
ALTER TABLE "Map" DROP COLUMN "submittedById",
ADD COLUMN     "submittedBy_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "mapId",
DROP COLUMN "userId",
ADD COLUMN     "map_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "quaverId",
ADD COLUMN     "quaver_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_submittedBy_id_fkey" FOREIGN KEY ("submittedBy_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
