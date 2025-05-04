/*
  Warnings:

  - The primary key for the `produk` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idProduk` on the `produk` table. All the data in the column will be lost.
  - Added the required column `produkId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalBayar` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `suborder` DROP FOREIGN KEY `SubOrder_produkId_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `produkId` INTEGER NOT NULL,
    ADD COLUMN `totalBayar` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `produk` DROP PRIMARY KEY,
    DROP COLUMN `idProduk`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
