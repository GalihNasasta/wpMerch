import { Category, Prisma } from '@prisma/client'
import  { NextFunction, Request, Response } from 'express'
import { stat } from 'fs'
import Joi from 'joi'

// menambahkan data untuk kebutuhan data
const addDataSchema = Joi.object({
    nama: Joi.string().required(),
    harga: Joi.number().min(0).required(),
    category: Joi.string().valid("BAJU", "GANTUNGAN", "STIKER").required(),
    desc: Joi.string().optional(),
    stok: Joi.number().required(),
    foto: Joi.string().optional(),
    user: Joi.optional()
})

const editDataSchema = Joi.object({
    nama: Joi.string().optional(),
    harga: Joi.number().min(0).optional(),
    category: Joi.string().valid('BAJU', 'GANTUNGAN', 'STIKER').optional(),
    desc: Joi.string().optional(),
    stok: Joi.number().optional(),
    foto: Joi.string().optional(),
    user: Joi.optional()
})

export const verifyAddProduct = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditMenu = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}