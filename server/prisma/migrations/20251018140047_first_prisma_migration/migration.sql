-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('TENANT', 'OWNER');

-- CreateTable
CREATE TABLE "public"."User" (
    "UserID" SERIAL NOT NULL,
    "authId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'TENANT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "public"."Dormitory" (
    "Dormitoryid" SERIAL NOT NULL,
    "Dormitoryname" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "ownerAuthId" TEXT,

    CONSTRAINT "Dormitory_pkey" PRIMARY KEY ("Dormitoryid")
);

-- CreateTable
CREATE TABLE "public"."Building" (
    "BuildingID" SERIAL NOT NULL,
    "BuildingName" TEXT NOT NULL,
    "dormitoryId" INTEGER NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("BuildingID")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "RoomID" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "statusId" INTEGER NOT NULL,
    "buildingId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("RoomID")
);

-- CreateTable
CREATE TABLE "public"."Status" (
    "StatusID" SERIAL NOT NULL,
    "Type" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("StatusID")
);

-- CreateTable
CREATE TABLE "public"."Tenant" (
    "TenantID" SERIAL NOT NULL,
    "FName" TEXT NOT NULL,
    "LName" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Gmail" TEXT NOT NULL,
    "Tel" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("TenantID")
);

-- CreateTable
CREATE TABLE "public"."Roommate" (
    "RoommateID" SERIAL NOT NULL,
    "FName" TEXT NOT NULL,
    "LName" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Gmail" TEXT NOT NULL,
    "Tel" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "Roommate_pkey" PRIMARY KEY ("RoommateID")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "ContractID" SERIAL NOT NULL,
    "Code" TEXT NOT NULL,
    "DayStart" TIMESTAMP(3) NOT NULL,
    "DayEnd" TIMESTAMP(3) NOT NULL,
    "roomId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("ContractID")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "InvoiceID" SERIAL NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "roomId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("InvoiceID")
);

-- CreateTable
CREATE TABLE "public"."ItemList" (
    "ItemListID" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ItemList_pkey" PRIMARY KEY ("ItemListID")
);

-- CreateTable
CREATE TABLE "public"."Item" (
    "ItemID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("ItemID")
);

-- CreateTable
CREATE TABLE "public"."Receipt" (
    "ReceiptID" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "proof" TEXT,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("ReceiptID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "public"."User"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_key" ON "public"."Tenant"("userId");

-- AddForeignKey
ALTER TABLE "public"."Building" ADD CONSTRAINT "Building_dormitoryId_fkey" FOREIGN KEY ("dormitoryId") REFERENCES "public"."Dormitory"("Dormitoryid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "public"."Building"("BuildingID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("StatusID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("UserID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Roommate" ADD CONSTRAINT "Roommate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("TenantID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("RoomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("TenantID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("RoomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("StatusID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemList" ADD CONSTRAINT "ItemList_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("InvoiceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemList" ADD CONSTRAINT "ItemList_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("ItemID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("StatusID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Receipt" ADD CONSTRAINT "Receipt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("InvoiceID") ON DELETE RESTRICT ON UPDATE CASCADE;
