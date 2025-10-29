-- CreateTable
CREATE TABLE "public"."InvoiceCounter" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "currentNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceCounter_accountId_year_month_key" ON "public"."InvoiceCounter"("accountId", "year", "month");

-- AddForeignKey
ALTER TABLE "public"."InvoiceCounter" ADD CONSTRAINT "InvoiceCounter_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;
