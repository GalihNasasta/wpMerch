-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_idProduk_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `totalBayar` INTEGER NULL,
    MODIFY `idProduk` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_idProduk_fkey` FOREIGN KEY (`idProduk`) REFERENCES `Produk`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
