import express, { type NextFunction, type Request, type Response } from "express";
import { authRouter } from "./modules/auth/auth.routee.js";
import { pollingRouter } from "./modules/polling/polling.routee.js";
import { responseRouter } from "./modules/response/response.routee.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./common/middlewares/error.middleware.js";

const FRONTEND_URL = process.env.FRONTEND_HOST_URL || "https://pollingstack.vercel.app";

export function createExpress() {
  const app = express();

  

app.use(cors({
    origin: "https://pollingstack.vercel.app",
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: [
        "Content-type",
        "Authorization",
        "Pragma",
        "Cache-control",
        "Expires"
    ],
    credentials: true
}))

  app.use(express.json());
  app.use(cookieParser());

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).json({
    message: err.message
  })
})

  app.get("/health", (_req: Request, res: Response) => {
    return res.status(200).json({ message: "Ok up and running" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/poll", pollingRouter);
  app.use("/api/response", responseRouter);

  app.use(errorMiddleware)

  return app;
}
