-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "mapCount" INTEGER NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "scoreCount" INTEGER NOT NULL DEFAULT 0,
    "categoryMapCount" INTEGER[] DEFAULT ARRAY[0, 0, 0, 0, 0]::INTEGER[],

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);
