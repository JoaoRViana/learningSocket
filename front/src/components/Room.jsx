import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useLocation } from 'react-router-dom';


function Home() {
  const [yourId, setYourId] = useState('');
  const [anotherId, setAnotherId] = useState('');
  const [userName,setUserName] = useState('')
  const [anotherPlayer,setAnotherPlayer] = useState('')
  const url = window.location.href;
  const first = url.indexOf('/', 10);
  const id = url.slice(first + 1);
  const location = useLocation();
  
  useEffect(() => {
    socket.emit("joinRoom", {room:id,userName:location.state});
    setYourId(socket.id);
    setUserName(location.state)
    socket.emit("usersInRoom",id)
    socket.on("receiveConnection",(data)=>{
    console.log(data)
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
