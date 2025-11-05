/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Roommate` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Roommate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Contract" DROP CONSTRAINT "Contract_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Roommate" DROP CONSTRAINT "Roommate_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tenant" DROP CONSTRAINT "Tenant_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Contract" DROP COLUMN "tenantId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Roommate" DROP COLUMN "tenantId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "fullName",
ADD COLUMN     "FName" TEXT NOT NULL,
ADD COLUMN     "LName" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Tenant";

-- AddForeignKey
ALTER TABLE "public"."Roommate" ADD CONSTRAINT "Roommate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
