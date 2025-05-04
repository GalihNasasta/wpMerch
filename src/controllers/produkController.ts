import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs"

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllProduk = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allProducts = await prisma.produk.findMany({
            where: { nama: { contains: search?.toString() || "" } }
        })

        // output
        return response.json({
            status: true,
            data: allProducts,
            message: "Produk has retrieved"
        })
        .status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createProduk = async (request: Request, response: Response) => {
    try {
        const { nama, harga, category, stok, desc } = request.body
        const uuid = uuidv4()

        const newProduk = await prisma.produk.create({
            data: { uuid, nama, harga: Number(harga), category, stok, desc }
        })

        return response.json({
            status: true,
            data: newProduk,
            message: "Menu berhasil ditambahkan"
        })
        .status(200)
    } catch  (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }

}

export const updateProduk = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { nama, harga, category, stok, desc } = request.body

        const findProduk = await prisma.produk.findFirst({ where: { id: Number(id) } })
        if  (!findProduk) return response
            .status(200)
            .json({ status: false, message: "Product is not found" })

        const updateMenu = await prisma.produk.update({
            data: {
                nama: nama || findProduk.nama,
                harga: harga ? Number(harga) : findProduk.harga,
                category: category || findProduk.category,
                desc: desc || desc.description,
                stok: stok || findProduk.stok
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updateMenu,
            message: 'Berhasil Memperbarui'
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error ${error}`
            }).status(400)    

    }
}

export const changePicture = async (request: Request, response: Response) => {
    try {
        const  { id } = request.params

        const  findMenu = await prisma.produk.findFirst({ where: { id: Number(id) } })
        if  (!findMenu) return response
            .status(200)
            .json({ status: false, message: 'Product is not found' })

        let filename = findMenu.foto
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/menu_picture/${findMenu.foto}`
            let exist = fs.existsSync(path)
            if(exist && findMenu.foto !== ``) fs.unlinkSync(path)
        }

        const updatePicture = await  prisma.produk.update({
            data: { foto: filename },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatePicture,
            message: 'Picture has changed'
        }).status(200)

    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }

}

export  const deleteProduk = async (request: Request, response: Response) => {
    try {
        const { id } = request.params // untuk mencari id produk yang akan di hapus

        const findMenu = await prisma.produk.findFirst({ where: { id: Number(id) }})
        if  (!findMenu) return response
            .status(200)
            .json({ status: false, message: 'Produk is not found' })

        /** Mengecek foto lama yang ada di folder */
        let path = `${BASE_URL}/../public/menu_picture/${findMenu.foto}`
        let exist = fs.existsSync(path)
        /** menghapus foto lama jika ada reupload file baru */
        if(exist && findMenu.foto !== ``) fs.unlinkSync(path)

        const  deleteMenu = await prisma.produk.delete({
            where: { id: Number(id) }
        })
        return  response.json({
            status: true,
            data: deleteMenu,
            message: 'Product has deleted'
        }).status(200)
    }  catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error ${error}`
            })
            .status(400)
    }    

}