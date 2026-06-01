import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";

const route = Router();

route.post("/",auth("contributor","maintainer"),issuesController.createIssues);
route.get("/",issuesController.getAllIssues)
route.get("/:id",issuesController.getIssueById)
route.put("/:id",auth("contributor","maintainer"),issuesController.updateIssueById)
route.delete("/:id",auth("maintainer"),issuesController.deleteIssueById)

export const issuesRoute = route;