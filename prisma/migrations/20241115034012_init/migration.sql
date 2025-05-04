-- AlterTable
ALTER TABLE `order` MODIFY `bukti_bayar` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE `suborder` ADD COLUMN `alamat` VARCHAR(191) NULL;
