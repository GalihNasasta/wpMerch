import { NextFunction, Request, Response } from "express";
import Joi from "joi"
import { upBuktiBayar } from "../controllers/orderController";

const subOrderSchema = Joi.object({
    idProduk: Joi.number().required(),
    quantity: Joi.number().required(),
    note: Joi.string().optional(),
    alamat: Joi.string().optional()
})

const addDataSchema = Joi.object({
    customer: Joi.string().required(),
    metode_bayar: Joi.string().valid("CASH", "QRIS").uppercase().required(),
    bukti_bayar: Joi.string().optional(),
    userId: Joi.number().optional(),
    subOrder: Joi.array().items(subOrderSchema).min(1).required(),
    user: Joi.optional()
})

export const verifyAddOrder = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(detail => detail.message).join()
        })
    }
    return next()
}

const editDataSchema = Joi.object({
    satus: Joi.string().valid("DONE").uppercase().required(),
    bukti_bayar: Joi.allow().optional(),
    user: Joi.optional(),
})

export const verifyEditStatus = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(detail => detail.message).join()
        })
    }
    return next()
}