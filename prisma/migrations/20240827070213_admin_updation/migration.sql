-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FINANCE', 'SUPPORT', 'OPERATION');

-- CreateTable
CREATE TABLE "User_Admin" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Admin_phoneNumber_key" ON "User_Admin"("phoneNumber");
