const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    if (!rooms.has(roomName)) {
      rooms.set(roomName, { players: new Map(), created: null });
    }
    const roomData = rooms.get(roomName);
    if (roomData.players.size < 2) {
      const user = { id: socket.id, name: `User${roomData.players.size + 1}` };
      roomData.players.set(socket.id, user);
      if (roomData.players.size === 1) {
        roomData.created = socket.id;
      }
    }
    socket.emit("userJoined", Array.from(roomData.players.values()));
    io.emit("receiveRooms", Array.from(rooms.keys()));
  });
  
  socket.on("getRooms", () => {
    // Verifique e remova salas vazias
    for (const [roomName, roomData] of rooms.entries()) {
      if (roomData.players.size === 0) {
        rooms.delete(roomName);
      }
    }
    io.emit("receiveRooms", Array.from(rooms.keys()));
  });

  socket.on("disconnect", () => {
    for (const roomData of rooms.values()) {
      roomData.players.delete(socket.id);
      if (socket.id === roomData.created && roomData.players.size > 0) {
        roomData.created = Array.from(roomData.players.keys())[0];
      }
    }
  });
});

server.listen(3001, () => {
  console.log('Servidor Socket.io em execução na porta 3001');
});
