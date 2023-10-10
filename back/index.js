const express = require('express');
const app  = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);
const rooms = new Set();
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    socket.on("sendMessage",(data)=>{
        socket.to(data.room).emit("receiveMessage",data)
    })

    socket.on("joinRoom",(data)=>{
        socket.join(data);
        rooms.add(data);
        io.emit("receiveRooms", Array.from(rooms));
    });

    socket.on("getRooms", () => {
        socket.emit("receiveRooms", Array.from(rooms));
    });
})


server.listen(3001,()=>{
    console.log('RUNNING')
})
