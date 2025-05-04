import  { NextFunction, Request, Response } from 'express'
import { request } from 'http'
import Joi from 'joi'

const authSchema = Joi.object({
    email: Joi.string().required(),
    password:  Joi.string().min(3).alphanum().required()
})

const addDataSchema = Joi.object({
    nama: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(3).alphanum().required(),
    telepon: Joi.string().required(),
    alamat: Joi.string().required(),
    role: Joi.string().valid("ADMIN", "CUSTOMER").required(),
    profile_picture: Joi.string().optional()
})

const editDataSchema = Joi.object({ 
    nama: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().min(3).alphanum().optional(),
    telepon: Joi.string().optional(),
    alamat: Joi.string().optional(),
    role: Joi.string().valid("ADMIN", "CUSTOMER").optional(),
    profile_picture: Joi.string().optional(),
    user:Joi.optional()
    
})

export const verifyAuthentication = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { error } = authSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join()
        })
    }
    return next()
}

export const verifyAddData = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join()
        })
    }
    return next()
}

export const verifyEditUser = (request: Request,  response: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(request.body, { abortEarly: false })

    if  (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map((it) => it.message).join()
        })
    }
    return next()
}
