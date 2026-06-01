import type { NextFunction, Request, Response } from "express";

const globalerror = (err: any, req: Request, res: Response, next: NextFunction) => {

    res.status(500).json({
        success: false,
        message: err?.message || "Internal Server Error",
        errors: err
    });
};

export default globalerror;