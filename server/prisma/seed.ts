import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env file
config({ path: path.join(__dirname, "..", ".env") });

const prisma = new PrismaClient();

async function deleteAllData() {
  // Manually specify the order of deletion
  const modelNames = [
    "SaleItem",
    "SaleOrder",
    "Sales",
    "Purchases",
    "Products",
    "Customer",
    "Expenses",
    "ExpenseByCategory",
    "ExpenseSummary",
    "SalesSummary",
    "PurchaseSummary",
    "InvoiceCounter",
    "Account",
  ];

  // Delete in reverse order to respect foreign key constraints
  for (const modelName of modelNames) {
    const model: any = prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1) as keyof typeof prisma];
    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "account.json",
    "customer.json",
    "products.json",
    "sales.json",
    "purchases.json",
    "expenses.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "expenseSummary.json",
    "expenseByCategory.json",
  ];

  await deleteAllData();

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
