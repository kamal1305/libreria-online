/*
  Warnings:

  - You are about to drop the column `instagramUrl` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN "instagramUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "publisher" TEXT,
    "publicationYear" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'es',
    "format" TEXT,
    "pages" INTEGER,
    "condition" TEXT NOT NULL,
    "description" TEXT,
    "defects" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "price" DECIMAL NOT NULL,
    "acquisitionCost" DECIMAL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "demoData" BOOLEAN NOT NULL DEFAULT false,
    "amazonAffiliateUrl" TEXT,
    "categoryId" TEXT,
    "batchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Book_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "AcquisitionBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("acquisitionCost", "amazonAffiliateUrl", "author", "batchId", "categoryId", "condition", "createdAt", "defects", "demoData", "description", "format", "id", "imageAlt", "imageUrl", "isbn", "language", "pages", "price", "publicationYear", "publisher", "slug", "status", "stock", "title", "updatedAt") SELECT "acquisitionCost", "amazonAffiliateUrl", "author", "batchId", "categoryId", "condition", "createdAt", "defects", "demoData", "description", "format", "id", "imageAlt", "imageUrl", "isbn", "language", "pages", "price", "publicationYear", "publisher", "slug", "status", "stock", "title", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");
CREATE INDEX "Book_status_stock_idx" ON "Book"("status", "stock");
CREATE INDEX "Book_title_idx" ON "Book"("title");
CREATE INDEX "Book_author_idx" ON "Book"("author");
CREATE INDEX "Book_publisher_idx" ON "Book"("publisher");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
