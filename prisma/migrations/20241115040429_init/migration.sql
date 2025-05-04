-- DropForeignKey
ALTER TABLE `suborder` DROP FOREIGN KEY `SubOrder_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `suborder` DROP FOREIGN KEY `SubOrder_produkId_fkey`;

-- AlterTable
ALTER TABLE `suborder` ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `quantity` INTEGER NULL,
    MODIFY `orderId` INTEGER NULL,
    MODIFY `produkId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`idOrder`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
