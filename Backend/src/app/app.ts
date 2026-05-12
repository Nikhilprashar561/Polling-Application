import express, { type Request, type Response } from "express";
import { authRouter } from "./modules/auth/auth.routee.js";
import { pollingRouter } from "./modules/polling/polling.routee.js";
import { responseRouter } from "./modules/response/response.routee.js";
import cookieParser from "cookie-parser";

export function createExpress(){
    const app = express();

    app.use(express.json());
    app.use(cookieParser())

    app.get('/health', (req: Request, res: Response) => {
        return res.status(200).json({message: "Ok up and running"})
    })

    app.use('/api/auth', authRouter);
    app.use('/api/poll', pollingRouter);
    app.use('/api/response', responseRouter)

    return app
}
