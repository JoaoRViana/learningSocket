import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react"

const socket = io.connect("http://localhost:3001");

function App() {
  const [message,setMessage] = useState("");
  const [messageReceived,setMessageReceived] = useState("");


  const sendMessage = () =>{
    socket.emit("sendMessage",{message})
  }
  useEffect(()=>{
    socket.on("receiveMessage",(data)=>{
      setMessageReceived(data.message)
    })
  },[socket])

  return (
    <div className="App">
      <input placeholder="Message" onChange={(e)=>{
        setMessage(e.target.value)
      }}>
      </input>
      <button onClick={sendMessage}>Send message</button>
      <h1>Message:</h1>
      <h2>{messageReceived}</h2>
    </div>
  );
}

export default App;
