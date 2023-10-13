import React, { useEffect, useRef, useState } from "react";
import socket from "./socket";
import { useLocation,useNavigate } from 'react-router-dom';


function Home() {
  const choosedOption = useRef('');
  const [enemyOption,setEnemyOption] = useState(false)
  const [disableButtons,setDisableButtons] = useState(false)
  const [userName,setUserName] = useState('')
  const [anotherPlayer,setAnotherPlayer] = useState("")
  const [result,setResult] = useState('')
  const url = window.location.href;
  const first = url.indexOf('/', 10);
  const id = url.slice(first + 1);
  const location = useLocation();
  console.log(enemyOption)
  
  const playChoosed = (e)=>{
    choosedOption.current = e
    setDisableButtons(true);
    socket.emit("sendOption",{id:socket.id,option:e,room:id})
  }

  useEffect(() => {
    socket.emit("joinRoom", {room:id,userName:location.state});
    setUserName(location.state)
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
      if((enemy.option === 'scissors' && choosedOption.current === 'rock') ||
      (enemy.option === 'paper' && choosedOption.current === 'scissors') ||
      (enemy.option === 'rock' && choosedOption.current === 'paper')){
        setResult('winner')
      }else if((choosedOption.current === 'scissors' && enemy.option === 'rock') ||
      (choosedOption.current === 'paper' && enemy.option === 'scissors') ||
      (choosedOption.current === 'rock' && enemy.option === 'paper')){
        setResult('loose')
      }else{
        setResult('draw')
      }
    })
    socket.on("playAgain",()=>{
      window.location.reload()
    })
    socket.emit("getRooms");
  }, [socket]);

  return (
    <div className="bg-slate-200 h-screen">
      <div className="mx-auto flex justify-center p-2 my-2">
        <button className="w-20 h-12 bg-slate-400 text-center rounded-md" onClick={()=>{
          window.location.replace('/');
        }}>Home</button>
      </div>
      <div className="justify-center mx-auto flex my-2 p-5">
        <h3>Room: {id}</h3>
      </div>
      <div className="flex justify-between flex-wrap h-[400px] ">
        <div className="flex mx-5 justify- flex-wrap  bg-blue-400 h-[100%] w-[500px] p-5 border-gray border-2">
          <h2 className="w-full text-center h-10 flex items-center justify-center">{userName}</h2>
        <div className="flex justify-around w-full">
          <button value={'rock'} className="border-2 border-slate-500 p-3 h-10 flex items-center bg-slate-600 disabled:opacity-75 w-20 justify-center" disabled={disableButtons} onClick={(e)=>{
            playChoosed(e.target.value)
            e.target.style.background = 'green'
          }}>rock</button>
          <button value={'paper'} className="border-2 border-slate-500 p-3 h-10 flex items-center bg-slate-600 disabled:opacity-75 w-20 justify-center" disabled={disableButtons} onClick={(e)=>{
            playChoosed(e.target.value)
            e.target.style.background = 'green'
          }}>paper</button>
          <button value={'scissors'} className="border-2 border-slate-500 p-3 h-10 flex items-center bg-slate-600 disabled:opacity-75 w-20 justify-center" disabled={disableButtons} onClick={(e)=>{
            playChoosed(e.target.value)
            e.target.style.background = 'green'
          }}>scissors</button>
          </div>
          
        </div>
        <div className="flex mx-5 text-center bg-red-400 h-[100%] w-[500px] justify-center p-5 border-black border-2">
          {anotherPlayer===""?<h2>Waiting for player...</h2>:
          <div className="flex items-center justify-center w-full flex-wrap">
            <div className="flex justify-center items-center w-full">
            <h2>{anotherPlayer}</h2>
            </div>
            <div className="flex justify-center items-center w-full text-xl text-red-800">
            {choosedOption.current !== '' && result !==''?<h2>{enemyOption}</h2>:<div>Waiting player Choose...</div>}
            </div>
           
          </div>
          }
        </div>
      </div>
      {anotherPlayer !==''? <div>
      {result === ''?<div/>:
      <div className="flex justify-center flex-wrap mx-auto">
        <div className="w-full justify-center flex p-2 my-2">
          <h2 className="text-xl">{result}</h2>
        </div>
        <div className="w-full justify-center flex p-2 my-2">
        <button className="bg-yellow-600 rounded-md w-20 h-12 text-center"
         onClick={()=>{
          socket.emit('anotherMatch',id)
      }}>Play again</button>
          </div>
      </div>
      }
      </div>:<div/>}
     
    </div>
  );
}

export default Home;
