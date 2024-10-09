import { Request } from "express";
import multer from "multer";
import { BASE_URL } from "../global";

/** Mendefinisikan konfigurasi penyimpanan dari Menu Picture */
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        /** mendefinisi lokasi dari foto yang akan di upload, pastikan sudah membuat folder "public" di folder root.
         * lalu membuat folfer "menu_picture" di dalam "public folder"
         */
        cb(null, `${BASE_URL}/public/profile_picture`)
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        /** definisi nama file dari file yang di upload */
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
    }
})

const uploadFile = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 } /** mendefinisi ukuran maksimal dari file (pada contoh ini maksimal 3mb) */
})

export default uploadFile