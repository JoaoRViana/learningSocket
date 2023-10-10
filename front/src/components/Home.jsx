import io from 'socket.io-client';
import { useEffect, useState } from "react"

const socket = io.connect("http://localhost:3001");

function Home() {
  const [room, setRoom] = useState("");
  const [allRooms, setAllRooms] = useState([]);

  const createRoom = () => {
    if (room !== '') {
      joinRoom(room)
    }
  }

  const joinRoom = (roomName) => {
    socket.emit("joinRoom", roomName);
    socket.emit("receiveConnection",roomName)
    window.location.replace(`/${roomName}`);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("getRooms");
    });

    socket.on("receiveRooms", (data) => {
      setAllRooms(data);
    });
  }, [socket]);

  return (
    <div className='block flex-wrap h-screen '>
        <div className='flex justify-center flex-wrap  p-5 w-[440px] h-60 mx-auto  items-center'>
            <input className='border-black border-2 w-[100px] h-10 mx-2 rounded-lg text-center bg-slate-500 text-black'
            onChange={(e) => {
            setRoom(e.target.value);
            }}/>
        <button onClick={createRoom} className='bg-slate-300 h-12 w-36 rounded-lg'>Create Room</button>
        </div>
      <div  className='flex items-center flex-wrap w-60 bg-slate-400 mx-auto p-5 text-center'>
        <h2 className='w-full'>All Rooms:</h2>
        {allRooms.map((roomName, i) => (
            <div key={`room${i}`} className='w-full flex justify-center items-center my-2 border-b-2 p-2'>
            <h3 className=' h-8 w-16 text-center bg'>{roomName}</h3>
            <button
             className='bg-slate-300 h-8 w-16 rounded-lg'
             onClick={() => joinRoom(roomName)}>Join</button>
            </div>
        ))}
        </div>
     
    </div>
  );
}

export default Home;
