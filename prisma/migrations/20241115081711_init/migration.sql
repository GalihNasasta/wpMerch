/*
  Warnings:

  - You are about to drop the column `idProduk` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_idProduk_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `idProduk`;
