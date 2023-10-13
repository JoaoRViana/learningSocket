const express = require('express');
const app  = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);
let rooms = [];
const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    },
});

io.on("connection",(socket)=>{
    socket.on("joinRoom",(data)=>{
        socket.join(data.room);
        rooms.forEach((e)=>{
          if(e.room === data.room){
            e.users.push({id:socket.id,userName:data.userName})
          }else{
            rooms.push({
              room:data.room,
              users:[{id:socket.id,userName:data.userName}]
            })
          }
        })
        if(rooms.length <1){
          rooms.push({
            room:data.room,
            users:[{id:socket.id,userName:data.userName}]
          })
        }
        io.emit("receiveRooms",rooms);
    });
    socket.on("usersInRoom",(data)=>{
      const roomData = rooms.filter((e)=>(e.room ===data))[0];
      io.to(roomData.room).emit("receiveConnection",roomData.users)
    })
    socket.on("getRooms", () => {
        io.emit("receiveRooms",rooms);
    });
    socket.on("disconnect",()=>{
      rooms.forEach((e,i)=>{
        let newUsers = []
        e.users.forEach((user)=>{
          if(user.id !== socket.id){
            newUsers.push(user)
          }
        })
        rooms[i].users = newUsers;
        io.to(e.room).emit("receiveConnection",newUsers)
        if(e.users.length <1){
          const newRooms = rooms.filter((b)=> e.room !== b.room )
          rooms = newRooms
          io.emit("receiveRooms",rooms)
        }
      })
    })
    socket.on('sendOption',(data)=>{
      let roomData= [];
      let index= '';
      rooms.forEach((e,i)=>{
        if(e.room === data.room){
          roomData = e
          index = i
        }
      })
      let userIndex =''
      let userOption = ''
      roomData.users.forEach((e,i)=>{
        if(e.id === data.id){
          userIndex = i
          userOption = {...e,option:data.option}
        }
      })
      roomData.users[userIndex] = userOption;
      rooms[index] = roomData;
      let everyoneChoose = [];
      roomData.users.forEach((e)=>{
        if(Object.keys(e).length >2){
          everyoneChoose.push(true)
        }
      })
      if(everyoneChoose.length >1){
        io.to(data.room).emit('receiveOptions',roomData)
      } 
    })
    socket.on('anotherMatch',(data)=>{
      io.to(data).emit('playAgain',)
    })
})


server.listen(3001,()=>{
    console.log('RUNNING')
})
