import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global";
import md5 from "md5"
import fs from "fs"
import { sign } from "jsonwebtoken";

const prisma = new  PrismaClient({ errorFormat: "pretty" })

export const getAllUser = async (request: Request,  response: Response) => {
    try {
        const { search } = request.query
        const  allUser = await prisma.user.findMany({
            where: { nama: { contains: search?.toString() || "" } }
        })

        return response.json({
            status: true,
            data: allUser,
            message: "User retrieved successfully"
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

export  const createUser = async (request: Request,  response: Response) => {
    try {
        const  { nama, email, password, telepon, alamat, role } = request.body
        const uuid = uuidv4()

        const newUser = await prisma.user.create({
            data: { uuid, nama, email, password: md5(password), telepon, alamat, role }
        })

        return response.json({
            status: true,
            data: newUser,
            message: "User created successfully"
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

export  const register = async (request: Request,  response: Response) => {
    try {
        const  { nama, email, password, telepon, alamat } = request.body
        const uuid = uuidv4()
        const role = "CUSTOMER"

        const newCust = await prisma.user.create({
            data: { uuid, nama, email, password: md5(password), telepon, alamat, role }
        })

        return response.json({
            status: true,
            data: newCust,
            message: "User created successfully"
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

export const updateUser = async (request: Request,  response: Response) => {
    try {
        const { id } = request.params
        const { nama,  email, password, telepon, alamat, role } = request.body

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if  (!findUser) return response
        .status(200)
        .json({ status: false, message: "User is not found" })
        
        const  updateUser = await prisma.user.update({
            data: {
                nama: nama ||  findUser.nama,
                email: email || findUser.email,
                password: md5(password) || findUser.password,
                telepon: telepon || findUser.telepon,
                alamat: alamat || findUser.alamat,
                role: role || findUser.role
            },
            where: { id: Number(id) }
        }) 
        
        return response.json({
            status: true,
            data:  updateUser,
            message:  "User updated successfully"
        })
        .status(200)
    }  catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}

export const updateCust = async (request: Request,  response: Response) => {
    try {
        const { id } = request.params
        const { nama,  email, password, telepon, alamat } = request.body
        const role = "CUSTOMER"

        const findCust = await prisma.user.findFirst({ where: { id: Number(id) } })
        if  (!findCust) return response
        .status(200)
        .json({ status: false, message: "User is not found" })
        
        const  updateCust = await prisma.user.update({
            data: {
                nama: nama ||  findCust.nama,
                email: email || findCust.email,
                password: md5(password) || findCust.password,
                telepon: telepon || findCust.telepon,
                alamat: alamat || findCust.alamat,
                role
            },
            where: { id: Number(id) }
        }) 
        
        return response.json({
            status: true,
            data:  updateCust,
            message:  "User updated successfully"
        })
        .status(200)
    }  catch (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}

export const changeProPic = async (request: Request,  response: Response) => {
    try {
        const { id } = request.params
        
        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return response
            .status(200)
            .json({ status: false, message: 'User is not found' })

        let filename = findUser.foto
        if (request.file) {
            filename = request.file.filename
            let path = `${BASE_URL}/../public/profile_picture/${findUser.foto}`
            let exist = fs.existsSync(path)
            if (exist && findUser.foto !== ``) fs.unlinkSync(path)
        }

        const updateProPic = await prisma.user.update({
            data: { foto: filename },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data:  updateProPic,
            message:  "User deleted successfully"
        }).status(200)
        
    } catch  (error) {
        return response.json({
            status: false,
            message: `There is an error. ${error}`
        }).status(400)
    }
}

export const deleteUser =  async (request: Request,  response: Response) => {
    try {
        const { id } = request.params

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if  (!findUser) return response
            .status(200)
            .json({ status: false, message: 'User is not found' })

        let path =  `${BASE_URL}/../public/profile_picture/${findUser.foto}`
        let exist = fs.existsSync(path)

        if(exist && findUser.foto !== ``) fs.unlinkSync(path)

        const  deleteUser = await prisma.user.delete({
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: deleteUser,
            message:  "User deleted successfully"
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

        const  findUser = await prisma.user.findFirst({
            where: { email, password: md5(password) }
        })
        if (!findUser) return response
            .status(200)
            .json({
                status: false,
                logged: false,
                message: 'Email or password is invalid'
            })

        let data = {
            id:  findUser.id,
            name:  findUser.nama,
            email:   findUser.email
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