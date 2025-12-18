import express from "express";

const router = express.Router();

export const rooms = new Map();

router.post("/create", (req, res) => {
  const roomCode = Math.floor(100000 + Math.random() * 900000).toString();

  rooms.set(roomCode, {
    roomCode,
    host: null,          
    mode: "coding",
    code: "// Start coding...",
    board: [],
    members: [],
  });

  res.json({ success: true, roomCode });
});

router.get("/validate/:code", (req, res) => {
  const room = rooms.get(req.params.code);
  if (!room) {
    return res.status(404).json({ success: false });
  }
  res.json({ success: true });
});

export default router;
