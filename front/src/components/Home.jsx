import io from 'socket.io-client';
import { useEffect, useState } from "react"

const socket = io.connect("http://localhost:3001");

function Home() {
  const [room, setRoom] = useState("");
  const [allRooms, setAllRooms] = useState([]);

  const createRoom = () => {
    if (room !== '') {
      socket.emit("joinRoom", room);
    }
  }

  const joinRoom = (roomName) => {
    socket.emit("joinRoom", roomName);
    window.location.replace(`/${roomName}`);
  }

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("getRooms");
    });

    socket.on("receiveRooms", (data) => {
      setAllRooms(data);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveRooms");
    };
  }, []);

  return (
    <div className="App">
      <input
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      ></input>
      <button onClick={createRoom}>Create Room</button>
      <h2>All Rooms:</h2>
      {allRooms.map((roomName, i) => (
        <div key={`room${i}`}>
          <h3>{roomName}</h3>
          <button onClick={() => joinRoom(roomName)}>Join</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
