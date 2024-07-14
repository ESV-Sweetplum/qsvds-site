-- CreateTable
CREATE TABLE "Badge" (
    "badge_id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("badge_id")
);

-- CreateTable
CREATE TABLE "_BadgeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BadgeToUser_AB_unique" ON "_BadgeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BadgeToUser_B_index" ON "_BadgeToUser"("B");

-- AddForeignKey
ALTER TABLE "_BadgeToUser" ADD CONSTRAINT "_BadgeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("badge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToUser" ADD CONSTRAINT "_BadgeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
