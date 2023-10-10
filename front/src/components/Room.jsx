import io from 'socket.io-client';
import {useEffect, useState,} from "react"

const socket = io.connect("http://localhost:3001");
const url = window.location.href;
const first = url.indexOf('/',10);
function Home() {
    const id = url.slice(first+1)
    const joinRoom = (e)=>{
        socket.emit("joinRoom",e)
    }
    useEffect(()=>{
        joinRoom(id);
    },socket)
  return (
    
    <div className="App">
      <h3>Room:{id}</h3>
    </div>
  );
}

export default Home;
