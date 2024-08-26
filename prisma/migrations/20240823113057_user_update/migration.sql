-- DropIndex
DROP INDEX "User_firstName_key";

-- DropIndex
DROP INDEX "User_lastName_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
