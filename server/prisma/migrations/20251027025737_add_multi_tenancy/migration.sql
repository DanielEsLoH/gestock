/*
  Warnings:

  - Added the required column `accountId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `ExpenseByCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `ExpenseSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `PurchaseSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `SalesSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ExpenseByCategory" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ExpenseSummary" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Expenses" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Products" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."PurchaseSummary" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Purchases" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Sales" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SalesSummary" ADD COLUMN     "accountId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchases" ADD CONSTRAINT "Purchases_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expenses" ADD CONSTRAINT "Expenses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SalesSummary" ADD CONSTRAINT "SalesSummary_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseSummary" ADD CONSTRAINT "PurchaseSummary_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseSummary" ADD CONSTRAINT "ExpenseSummary_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseByCategory" ADD CONSTRAINT "ExpenseByCategory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;
