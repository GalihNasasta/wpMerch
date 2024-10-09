import  { NextFunction, Request, Response } from 'express'
import { request } from 'http'
import Joi from 'joi'

const authSchema = Joi.object({
    email: Joi.string().required(),
    password:  Joi.string().min(3).alphanum().required()
})

const addDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(3).alphanum().required(),
    telepon: Joi.number().required(),
    alamat: Joi.string().required(),
    profile_picture: Joi.string().optional()
})

const editDataSchema = Joi.object({ 
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().min(3).alphanum().optional(),
    telepon: Joi.number().optional(),
    alamat: Joi.string().optional(),
    profile_picture: Joi.string().optional()
    
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
