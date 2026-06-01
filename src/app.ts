import express from "express";
import type { Application, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./module/auth/auth.route";
import globalerror from "./middleware/globalerrorhandaler";
import { issuesRoute } from "./module/issues/issues.route";
import cors from "cors";

const app: Application = express();


app.use(express.json())

const corsOptions = {
    origin: config.cors_origin,
}

app.use(cors(corsOptions))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use("/api/auth", authRouter)
app.use("/api/issues", issuesRoute)


app.use(globalerror)

export default app