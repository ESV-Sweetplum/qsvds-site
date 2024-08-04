-- DropForeignKey
ALTER TABLE "Map" DROP CONSTRAINT "Map_submittedBy_id_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_map_id_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_map_id_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_user_id_fkey";

-- AlterTable
ALTER TABLE "Map" ALTER COLUMN "submittedBy_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_submittedBy_id_fkey" FOREIGN KEY ("submittedBy_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "Map"("map_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "Map"("map_id") ON DELETE CASCADE ON UPDATE CASCADE;
