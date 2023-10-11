import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const socket = io.connect("http://localhost:3001");
const url = window.location.href;
const first = url.indexOf('/', 10);

function Home() {
  const [yourId, setYourId] = useState('');
  const [anotherId, setAnotherId] = useState('');
  const [userName,setUserName] = useState('')
  const [anotherPlayer,setAnotherPlayer] = useState('')
  const id = url.slice(first + 1);
  const location = useLocation();
  
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinRoom", {room:id,userName:location.state});
      setYourId(socket.id);
      setUserName(location.state)
      socket.emit("usersInRoom",id)
    });
    socket.on("receiveConnection",(data)=>{
    data.forEach((e)=>{
      if(e.id!== socket.id){
        setAnotherId(e.id)
        setAnotherPlayer(e.userName)
      }
    })
    })
    socket.emit("getRooms");
  }, [socket]);

  return (
    <div>
      <h3>Room: {id}</h3>
      <h2>Your id: {userName}</h2>
      <h2>Another User id: {anotherPlayer}</h2>
      <h2>Users in Room: </h2>
    </div>
  );
}

export default Home;
