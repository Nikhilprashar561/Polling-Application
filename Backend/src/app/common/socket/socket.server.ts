import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

let io: Server | null = null;

const FRONTEND_URL = process.env.FRONTEND_HOST_URL;

export const socketServer = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
    origin: [
      "http://localhost:5173",
      "https://keep-betty-upc-depth.trycloudflare.com",
      "https://craps-maps-slim-reason.trycloudflare.com" // Frontene
     ],
    methods: ["GET", "POST"],
    credentials: true
  },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a poll room to get live vote updates
    socket.on("join_poll", (pollId: string) => {
      socket.join(`poll_${pollId}`);
      console.log(`Socket ${socket.id} joined poll_${pollId}`);
    });

    // Leave a poll room
    socket.on("leave_poll", (pollId: string) => {
      socket.leave(`poll_${pollId}`);
      console.log(`Socket ${socket.id} left poll_${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit live vote update to all clients in a poll room
export const emitVoteUpdate = (pollId: string, analyticsData: object) => {
  if (io) {
    io.to(`poll_${pollId}`).emit("vote_update", analyticsData);
  }
};

export { io };
