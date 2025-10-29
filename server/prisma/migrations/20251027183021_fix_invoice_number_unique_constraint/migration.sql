/*
  Warnings:

  - A unique constraint covering the columns `[accountId,invoiceNumber]` on the table `SaleOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."SaleOrder_invoiceNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "SaleOrder_accountId_invoiceNumber_key" ON "public"."SaleOrder"("accountId", "invoiceNumber");
