import type { NextFunction, Request, Response } from "express"
import sendResponse from "../utility/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (...roles: ROLES[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        try {

            const token = req.headers.authorization;

            if (!token) {
                return sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized access",
                })
            }

            const decoded = jwt.verify(token as string, config.secret_token as string) as JwtPayload;

            const userdata = await pool.query(`
                SELECT * FROM users WHERE id=$1`, [decoded.id]);


            const userdatarow = userdata.rows[0];

            if (userdata.rows[0].length === 0) {

                return sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "Requested resource does not exist",
                })
            }

            


            if (roles.length && !roles.includes(userdatarow.role)) {
                return sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Access denied.",
                })
            }






            req.userN = decoded

            next();



        }
        catch (error) {
            next(error)
        }

    }

}

export default auth