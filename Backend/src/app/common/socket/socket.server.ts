import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server | null = null;

const FRONTEND_URL = process.env.FRONTEND_HOST_URL;

export const socketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: { credentials: true, origin: FRONTEND_URL },
  });

  return io;
};
