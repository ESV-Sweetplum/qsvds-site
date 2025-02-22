-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "mapset_id" INTEGER NOT NULL DEFAULT -1;

-- CreateTable
CREATE TABLE "Mapset" (
    "mapset_id" SERIAL NOT NULL,

    CONSTRAINT "Mapset_pkey" PRIMARY KEY ("mapset_id")
);

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_mapset_id_fkey" FOREIGN KEY ("mapset_id") REFERENCES "Mapset"("mapset_id") ON DELETE RESTRICT ON UPDATE CASCADE;
