/*
  Warnings:

  - You are about to drop the column `produkId` on the `order` table. All the data in the column will be lost.
  - Added the required column `idProduk` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_produkId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `produkId`,
    ADD COLUMN `idProduk` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_idProduk_fkey` FOREIGN KEY (`idProduk`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
