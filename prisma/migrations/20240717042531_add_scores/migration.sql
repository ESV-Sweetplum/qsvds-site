-- CreateTable
CREATE TABLE "Score" (
    "score_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "map_id" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "pass" BOOLEAN NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("score_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_user_id_map_id_key" ON "Score"("user_id", "map_id");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "Map"("map_id") ON DELETE RESTRICT ON UPDATE CASCADE;
