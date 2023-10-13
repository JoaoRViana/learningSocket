import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import socket from "./socket";

function Home() {
  const [room, setRoom] = useState("");
  const [allRooms, setAllRooms] = useState([]);
  const [userName,setUserName] = useState('')
  const [disableButtons,setDisableButtons] = useState(true);

  let history = useNavigate();
  const createRoom = () => {
    if (room !== '') {
      joinRoom(room)
    }
  }

  const joinRoom = (roomName) => {
    history(`/${roomName}`,{state:userName})
  }

  useEffect(() => {
    socket.emit("getRooms");
    socket.on("receiveRooms", (data) => {
      const rooms = [];
      data.forEach((e)=>{
        rooms.push(e.room)
      })
      setAllRooms(rooms)
    });
  }, [socket]);

  return (
    <div className='block flex-wrap h-screen '>
        <div className='flex justify-center flex-wrap  p-5 w-[440px] my-2 mx-auto  items-center'>
          <input placeholder='UserName' onChange={(e)=>{
          setUserName(e.target.value)
          if(e.target.value.length >1){
            setDisableButtons(false)
          }else{
            setDisableButtons(true)
          }}}></input>
        </div>
        <div className='flex justify-center flex-wrap  p-5 w-[440px] my-2 mx-auto  items-center'>
            <input className='border-black border-2 w-[100px] h-10 mx-2 rounded-lg text-center bg-slate-500 text-black'
            onChange={(e) => {
            setRoom(e.target.value);
            }}/>
        <button onClick={createRoom} className='bg-slate-300 h-12 w-36 rounded-lg disabled:bg-red-300' disabled={disableButtons}>Create Room</button>
        </div>
      <div  className='flex items-center flex-wrap w-60 bg-slate-400 mx-auto p-5 text-center'>
        <h2 className='w-full'>All Rooms:</h2>
        {allRooms.map((roomName, i) => (
            <div key={`room${i}`} className='w-full flex justify-center items-center my-2 border-b-2 p-2'>
            <h3 className=' h-8 w-16 text-center bg'>{roomName}</h3>
            <button
             className='bg-slate-300 h-8 w-16 rounded-lg disabled:bg-red-300'
             onClick={() => joinRoom(roomName)}  disabled={disableButtons}>Join</button>
            </div>
        ))}
        </div>
     
    </div>
  );
}

export default Home;
