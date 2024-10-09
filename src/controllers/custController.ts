import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global";
import md5 from "md5"
import fs from "fs"
import { sign } from "jsonwebtoken";

const prisma = new  PrismaClient({ errorFormat: "pretty" })

export const getAllCust = async (request: Request,  response: Response) => {
    try {
        const { search } = request.query
        const  allCustomers = await prisma.customer.findMany({
            where: { nama: { contains: search?.toString() || "" } }
        })

        return response.json({
            status: true,
            data: allCustomers,
            message: "Customer retrieved successfully"
        })
        .status(200)
    } catch (error) {
        return response.json({
            status:  false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}

export  const createCust = async (request: Request,  response: Response) => {
    try {
        const  { nama, email, password, telepon, alamat } = request.body
        const uuid = uuidv4()

        const newCust = await prisma.customer.create({
            data: { uuid, nama, email, password: md5(password), telepon, alamat }
        })

        return response.json({
            status: true,
            data: newCust,
            message: "Customer created successfully"
        })
        .status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}

export const updateCustomer = async (request: Request,  response: Response) => {
    try {
        const { id } = request.params
        const { name,  email, password, telepon, alamat } = request.body

        const findCustomer = await prisma.customer.findFirst({ where: { idCust: Number(id) } })
        if  (!findCustomer) return response
        .status(200)
        .json({ status: false, message: "customer is not found" })
        
        const  updateCust = await prisma.customer.update({
            data: {
                nama: name ||  findCustomer.nama,
                email: email || findCustomer.email,
                password: md5(password) || findCustomer.password,
                telepon: telepon || findCustomer.telepon,
                alamat: alamat || findCustomer.alamat
            },
            where: { idCust: Number(id) }
        }) 
        
        return response.json({
            status: true,
            data:  updateCust,
            message:  "Customer updated successfully"
        })
        .status(200)
    }  catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}

export const  changeProPic = async (request: Request,  response: Response) => {
    try {
        const { id } = request.params
        
        const findcustomer = await prisma.customer.findFirst({ where: { idCust: Number(id) } })
        if (!findcustomer) return response
            .status(200)
            .json({ status: false, message: 'customer is not found' })

        let filename = findcustomer.foto
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/profile_picture/${findcustomer.foto}`
            let exist = fs.existsSync(path)
            if (exist && findcustomer.foto !== ``) fs.unlinkSync(path)
        }

        const updateProPic = await prisma.customer.update({
            data: { foto: filename },
            where: { idCust: Number(id) }
        })

        return response.json({
            status: true,
            data:  updateProPic,
            message:  "customer deleted successfully"
        }).status(200)
        
    } catch  (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}

export const deletecustomer =  async (request: Request,  response: Response) => {
    try {
        const { id } = request.params

        const findCustomer = await prisma.customer.findFirst({ where: { idCust: Number(id) } })
        if  (!findCustomer) return response
            .status(200)
            .json({ status: false, message: 'Customer is not found' })

        let path =  `${BASE_URL}/../public/profile_picture/${findCustomer.foto}`
        let exist = fs.existsSync(path)

        if(exist && findCustomer.foto !== ``) fs.unlinkSync(path)

        const  deletecustomer = await prisma.customer.delete({
            where: { idCust: Number(id) }
        })

        return response.json({
            status: true,
            data: deletecustomer,
            message:  "customer deleted successfully"
        }).status(200)

    }  catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }

}

export const authentication = async  (request: Request, response: Response) => {
    try {
        const { email, password } = request.body

        const  findcustomer = await prisma.customer.findFirst({
            where: { email, password: md5(password) }
        })
        if (!findcustomer) return response
            .status(200)
            .json({
                status: false,
                logged: false,
                message: 'Email or password is invalid'
            })

        let data = {
            id:  findcustomer.idCust,
            name:  findcustomer.nama,
            email:   findcustomer.email
        }

        let payload = JSON.stringify(data)

        let token = sign(payload, SECRET || "token")

        return response
            .status(200)
            .json({ status:  true, logged: true, message: "Login Success", token })
    }  catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        })
        .status(400)
    }
}