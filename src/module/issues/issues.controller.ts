import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issuesService } from "./issues.service";
import type { JwtPayload } from "jsonwebtoken";

const createIssues = async (req: Request, res: Response, next: NextFunction) => {


    try {

        const { title, description, type } = req.body
        const user = req.userN as JwtPayload;
        const userid = user.id;


        const result = await issuesService.createIssues_DB({ title, description, type, userid });

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        })

    }
    catch (error: any) {
        next(error)
    }


}

const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const result = await issuesService.getAllIssues_DB(req.query);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result
        })

    }
    catch (error: any) {
        next(error)
    }
}

const getIssueById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await issuesService.getIssueById_DB(id as string);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result
        })

    } catch (error: any) {
        next(error);
    }
};


const updateIssueById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const { title, description, type, status } = req.body;

        const result = await issuesService.updateIssueById_DB(id as string, { title, description, type });

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result
        })

    } catch (error: any) {
        next(error);
    }
};


const deleteIssueById = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;

        const result = await issuesService.deleteIssueById_DB(id as string);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
            data:{}
        })

    }
    catch (error: any) {
        next(error);

    }
}

export const issuesController = {
    createIssues,
    getAllIssues,
    getIssueById,
    updateIssueById,
    deleteIssueById
}