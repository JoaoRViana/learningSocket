import React, { useEffect, useRef, useState } from "react";
import socket from "./socket";
import { useLocation } from 'react-router-dom';


function Home() {
  const choosedOption = useRef('');
  const [enemyOption,setEnemyOption] = useState('')
  const [playerId,setPlayerId] = useState('');
  const [userName,setUserName] = useState('')
  const [anotherPlayer,setAnotherPlayer] = useState("")
  const [result,setResult] = useState('')
  const url = window.location.href;
  const first = url.indexOf('/', 10);
  const id = url.slice(first + 1);
  const location = useLocation();
  
  const playChoosed = (e)=>{
    choosedOption.current = e
    console.log(e)
    socket.emit("sendOption",{id:socket.id,option:e,room:id})
  }

  useEffect(() => {
    socket.emit("joinRoom", {room:id,userName:location.state});
    setUserName(location.state)
    setPlayerId(socket.id)
    socket.emit("usersInRoom",id)
    socket.on("receiveConnection",(data)=>{
    if(data.length>1){
      data.forEach((e)=>{
        if(e.id!== socket.id){
          setAnotherPlayer(e.userName)
        }
      })
    }else{
      setAnotherPlayer('')
    }
    })
    socket.on("receiveOptions",(data)=>{
      const enemy = data.users.filter((e)=>(e.id !==socket.id))[0];
      setEnemyOption(enemy.option)
      console.log(choosedOption)
      if((enemy.option === 'scissors' && choosedOption.current === 'rock') ||
      (enemy.option === 'paper' && choosedOption.current === 'scissors') ||
      (enemy.option === 'rock' && choosedOption.current === 'paper')){
        setResult('winner')
      }else if((choosedOption.current === 'scissors' && enemy.option === 'rock') ||
      (choosedOption.current === 'paper' && enemy.option === 'scissors') ||
      (choosedOption.current === 'rock' && enemy.option === 'paper')){
        setResult('lose')
      }else{
        setResult('draw')
      }
    })
    socket.emit("getRooms");
  }, [socket]);

  return (
    <div>
      <div className="justify-center mx-auto flex my-2 p-5">
        <h3>Room: {id}</h3>
      </div>
      <div className="flex justify-between h-[600px] ">
        <div className="flex mx-5 justify- flex-wrap  bg-blue-400 h-[30%] w-[500px] p-5 border-gray border-2">
          <h2 className="w-full text-center h-10 bg-red-400">{userName}</h2>
        <div className="flex justify-around w-full">
          <button value={'rock'} className="border-2 border-slate-500 p-3 h-10 flex items-center" onClick={(e)=>{
            playChoosed(e.target.value)
          }}>rock</button>
          <button value={'paper'} className="border-2 border-slate-500 p-3 h-10 flex items-center" onClick={(e)=>{
            playChoosed(e.target.value)
          }}>paper</button>
          <button value={'scissors'} className="border-2 border-slate-500 p-3 h-10 flex items-center" onClick={(e)=>{
            playChoosed(e.target.value)
          }}>scissors</button>
          </div>
          
        </div>
        <div className="flex mx-5 text-center bg-red-400 h-[30%] w-[500px] justify-center p-5 border-black border-2">
          {anotherPlayer===""?<h2>Waiting for player...</h2>:
          <div>
            <h2>{anotherPlayer}</h2>
            {choosedOption.current !== '' && result !==''?<h2>{enemyOption}</h2>:<div/>
      }
          </div>
          }
        </div>
      </div>
      {anotherPlayer !==''? <div>
      {choosedOption.current !== '' && result ===''?<h2>Waiting player Choose</h2>:
      <div>
        <h2>{result}</h2>
      </div>
      }
      </div>:<div/>}
     
    </div>
  );
}

export default Home;
