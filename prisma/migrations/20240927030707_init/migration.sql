-- CreateTable
CREATE TABLE `Admin` (
    `idAdmin` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `telepon` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_uuid_key`(`uuid`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    UNIQUE INDEX `Admin_telepon_key`(`telepon`),
    PRIMARY KEY (`idAdmin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `idCust` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `alamat` VARCHAR(191) NOT NULL DEFAULT '',
    `telepon` INTEGER NOT NULL,

    UNIQUE INDEX `Customer_uuid_key`(`uuid`),
    UNIQUE INDEX `Customer_email_key`(`email`),
    UNIQUE INDEX `Customer_telepon_key`(`telepon`),
    PRIMARY KEY (`idCust`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `idOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `custId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `metodeBayar` ENUM('CASH', 'QRIS') NOT NULL DEFAULT 'CASH',

    UNIQUE INDEX `Order_uuid_key`(`uuid`),
    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubOrder` (
    `idSubOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `orderId` INTEGER NOT NULL,
    `produkId` INTEGER NOT NULL,

    UNIQUE INDEX `SubOrder_uuid_key`(`uuid`),
    PRIMARY KEY (`idSubOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `idProduk` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `desc` TEXT NOT NULL DEFAULT '',
    `harga` INTEGER NOT NULL,
    `stok` INTEGER NOT NULL,
    `category` ENUM('BAJU', 'GANTUNGAN', 'STIKER') NOT NULL DEFAULT 'BAJU',
    `foto` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `Produk_uuid_key`(`uuid`),
    PRIMARY KEY (`idProduk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_custId_fkey` FOREIGN KEY (`custId`) REFERENCES `Customer`(`idCust`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`idOrder`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubOrder` ADD CONSTRAINT `SubOrder_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`idProduk`) ON DELETE RESTRICT ON UPDATE CASCADE;
