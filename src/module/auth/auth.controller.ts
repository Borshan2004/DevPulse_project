import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { authService } from "./auth.service";

const authRegistar = async (req: Request, res: Response,next:NextFunction) => {


    try {

        const result = await authService.auth_registar_DB(req.body)

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })

    }
    catch (error: any) {

      

        next(error);

    }




}

const authLogin = async (req: Request, res: Response, next: NextFunction) => {


    try {

        const result = await authService.auth_login_DB(req.body)

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: result
        })


    }
    catch (error: any) {

        next(error)

    }



}


export const authController = {
    authRegistar,
    authLogin
}