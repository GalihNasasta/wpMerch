import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global";
import fs from "fs"

const prisma = new PrismaClient({ errorFormat : 'pretty' })

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const { search } = request.body

        const allOrders = await prisma.order.findMany({
            where: {
                OR: [
                    { user: { nama: { contains: search?.toString() || "" } } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: { subOrder: true }
        })
        return response.json({
            status: true,
            data: allOrders,
            message: "Success get all orders"
        }).status(200)
    }   catch (error) {
        return response.json({
            status: false,
            message: `There is an error.${error}`
        }).status(400)
    }
}

export const createOrder = async (request: Request, response: Response) => {
    try {
        const { status, metodeBayar, subOrder } = request.body
        const user = request.body
        const uuid = uuidv4()

        let totalBayar = 0
        for (let index = 0; index < subOrder.length; index++) {
            const { idProduk } = subOrder[index]
            const detailProduk = await prisma.produk.findFirst({
                where: {
                    id: idProduk
                }
            })
            if(!detailProduk) return response
            .status(200).json({ status: false, message: `Menu with id
                ${idProduk} is not found` })
                totalBayar += (detailProduk.harga * subOrder[index].quantity)

                await prisma.produk.update({
                    where: {
                        id: idProduk
                    }, data: {
                        stok: detailProduk.stok - subOrder[index].quantity
                    }
                })
        }

        const newOrder = await prisma.order.create({
            data: { uuid, user, metodeBayar, status, totalBayar, userId: user.id }
        })

        for (let index = 0; index < subOrder.length; index++) {
            const uuid = uuidv4()
            const { produkId, quantity, note, alamat } = subOrder[index]
            await prisma.subOrder.create({
                data: {
                    uuid, orderId: newOrder.idOrder, produkId: Number(produkId), quantity: Number(quantity), note, alamat
                }
            })
        }
        return response.json({
            status: true,
            data: newOrder,
            message: `New order has been created`
        }).status(200)
    }   catch (error) {
            return response.json({
                status: false,
                message: `There is an error${error}`
            }).status(400)
    }
}

export const deleteOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findOrder = await prisma.order.findFirst({ where: { idOrder: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })

            let deleteSubOrder = await prisma.subOrder.deleteMany({ where: { orderId: Number(id) } })
            let deleteOrder = await prisma.order.deleteMany({ where: { idOrder: Number(id) } })

            return response.json({
                status: true,
                data: deleteOrder,
                message: `Order has been delete`
            }).status(200)
    }   catch (error) {
            return response.json({
                status: false,
                message: `There is an error.${error}`
            }).status(400)
    }
}

export const updateStatusOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { status } = request.body
        const user = request.body.user

        const findOrder = await prisma.order.findFirst({ where: { idOrder: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` }) 
        
        const updateStatus = await prisma.order.update({
            data: {
                status: status || findOrder.status,
                userId: user.id ? user.id : findOrder.userId
            },
            where: { idOrder: Number(id) }
        })

        return response.json({
            status: true, 
            data: updateStatus,
            message: `Order Status has Updated`
        }).status(200)
    }   catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error.${error}`
            }).status(400)
    }
}

export const upBuktiBayar = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const findOrder = await prisma.order.findFirst({ where: { idOrder: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: true, message: `Order not found` })
        
        let filename = findOrder.bukti_bayar
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../bukti_bayar${findOrder.bukti_bayar}`
            let exist = fs.existsSync(path)
            if(exist && findOrder.bukti_bayar !== ``) fs.unlinkSync(path)
        }
        const updatePict = await prisma.order.update({
            data: { bukti_bayar: filename, status: "PAID" },
            where: { idOrder: Number(id) }
        })
        return response.json({
            status: true,
            data: updatePict,
            message: `Update Bukti Bayar Success`
        }).status(200)
    }   catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error.${error}`
            }).status(400)
    }
}

export const getHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.body.user.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing or invalid.' });
        }

        const orders = await prisma.order.findMany({
            where: { userId: userId },
            include: {
                subOrder: true
            }
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        return res.status(200).json({
            status: true,
            message: 'Order history retrieved successfully.',
            data: orders,
        });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';

        return res.status(400).json({
            status: false,
            message: `Error: ${errorMessage}`,
        });
    }
};