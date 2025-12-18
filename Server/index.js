import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./Database/db.js";
import userRoute from "./Routes/userRoute.js";
import courseRoute from "./Routes/courseRoute.js";
import mediaRoute from "./Routes/mediaRoute.js";
import purchaseRoute from "./Routes/purchaseRoute.js";
import courseProgressRoute from "./Routes/courseProgressRoute.js";
import submissionRoute from "./Routes/submissionRoutes.js";
import aiCompilerRoutes from "./Routes/aiCompiler.js";
import interviewRoutes from "./Routes/interview.js";
import groupStudyRoutes, { rooms } from "./Routes/groupStudy.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://skill-engine.vercel.app"],
    credentials: true,
  },
});


app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://skill-engine.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/media", mediaRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/progress", courseProgressRoute);
app.use("/api/coding", submissionRoute);
app.use("/api/compiler-ai", aiCompilerRoutes);
app.use("/api", interviewRoutes);
app.use("/api/group-study", groupStudyRoutes);


io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("room:join", ({ roomCode, userName = "Anonymous" }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit("room:error", "Room not found");
      return;
    }

    socket.join(roomCode);

    room.users = room.users || [];
    room.users.push({ id: socket.id, name: userName });

    socket.emit("room:state", {
      roomCode,
      mode: room.mode,
      code: room.code,
      board: room.board,
      users: room.users,
    });

    socket.to(roomCode).emit("room:user-joined", userName);
    io.to(roomCode).emit("room:users", room.users);

    console.log(`👥 ${userName} joined room ${roomCode}`);
  });

  socket.on("mode:change", ({ roomCode, mode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.mode = mode;
    io.to(roomCode).emit("mode:updated", mode);
    io.to(roomCode).emit("room:activity", "Mode changed");
  });

  socket.on("code:update", ({ roomCode, code }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.code = code;
    socket.to(roomCode).emit("code:sync", code);
    socket.to(roomCode).emit("room:activity", "Someone is editing code");
  });

  socket.on("board:update", ({ roomCode, board }) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.board.push(board);
    socket.to(roomCode).emit("board:sync", board);
    socket.to(roomCode).emit("room:activity", "Whiteboard updated");
  });

  socket.on("code:run", ({ roomCode, output }) => {
    io.to(roomCode).emit("code:output", output);
  });

 
  socket.on("voice:join", ({ roomCode }) => {
    socket.join(roomCode);

    const clients =
      Array.from(io.sockets.adapter.rooms.get(roomCode) || []) || [];
    const others = clients.filter((id) => id !== socket.id);

    socket.emit("voice:existing-users", others);
    socket.to(roomCode).emit("voice:user-joined", socket.id);
  });

  socket.on("voice:offer", ({ to, offer }) => {
    io.to(to).emit("voice:offer", { from: socket.id, offer });
  });

  socket.on("voice:answer", ({ to, answer }) => {
    io.to(to).emit("voice:answer", { from: socket.id, answer });
  });

  socket.on("voice:ice", ({ to, candidate }) => {
    io.to(to).emit("voice:ice", { from: socket.id, candidate });
  });
  socket.on("room:leave", ({ roomCode }) => {
    socket.leave(roomCode);
  });


  socket.on("disconnect", () => {
    rooms.forEach((room, code) => {
      if (!room.users) return;

      const user = room.users.find((u) => u.id === socket.id);
      room.users = room.users.filter((u) => u.id !== socket.id);

      if (user) {
        socket.to(code).emit("room:user-left", user.name);
        io.to(code).emit("room:users", room.users);
      }

      if (room.users.length === 0) {
        rooms.delete(code);
        console.log(`🗑 Room ${code} deleted`);
      }
    });

    console.log("Disconnected:", socket.id);
  });
});

app.get("/", (_, res) => res.send("Server running "));

server.listen(process.env.PORT || 8080, () =>
  console.log("Server started")
);
