-- CreateTable
CREATE TABLE "AdministratorAction" (
    "action_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "AdministratorAction_pkey" PRIMARY KEY ("action_id")
);
