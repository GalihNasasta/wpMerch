/*
  Warnings:

  - Made the column `bukti_bayar` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `metodeBayar` ENUM('CASH', 'QRIS') NOT NULL DEFAULT 'QRIS',
    MODIFY `bukti_bayar` VARCHAR(191) NOT NULL DEFAULT '';
