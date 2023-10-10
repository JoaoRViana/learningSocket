import React, { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");
const url = window.location.href;
const first = url.indexOf('/', 10);

function Home() {
  const [yourId, setYourId] = useState('');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [createdUserId, setCreatedUserId] = useState(null);
  const id = url.slice(first + 1);

  useEffect(() => {
    socket.on("connect", () => {
      if (yourId === "") {
        socket.emit("joinRoom", id);
        setYourId(socket.id);
      }
    });

    socket.on("userJoined", (users) => {
      setUsersInRoom(users);
      console.log(users)
      const createdUser = users.find(user => user.id !== yourId);
      if (createdUser) {
        setCreatedUserId(createdUser.id);
      }
    });

    socket.on("receiveRooms", (rooms) => {
      console.log("Salas disponíveis:", rooms);
    });

    socket.on("disconnect", () => {
      // Lógica para lidar com desconexões
    });

    socket.emit("getRooms");
  }, [socket, yourId, createdUserId]);

  return (
    <div>
      <h3>Room: {id}</h3>
      <h2>Your id: {yourId}</h2>
      <h2>Created User id: {createdUserId}</h2>
      <h2>Users in Room:</h2>
      <ul>
        {usersInRoom.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
