import { useState } from "react";
import "./App.css";
import { socket } from "./utils/socket";
import Chatroom from "./Components/Chatroom";
import { IRoom } from "./interfaces/room.interface";

const initialRooms = [
  {
    id: "room-1",
    name: "Room 1",
    joined: false,
    messages: [],
  },
  {
    id: "room-2",
    name: "Room 2",
    joined: false,
    messages: [],
  },
];

function App() {
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState<IRoom[]>(initialRooms);


  function handleConnect() {
    socket.connect();
  }


  socket.on("me", () => {
    setConnected(true);
  });


  socket.on("join-room-success", (data: { roomId: string }) => {
    const updatedRooms = rooms.map((room) =>
      room.id === data.roomId
        ? { ...room, joined: true, messages: [...room.messages, "Joined room."] }
        : room
    );
    setRooms(updatedRooms);
  });


  socket.on("leave-room-success", (data: { roomId: string }) => {
    const updatedRooms = rooms.map((room) =>
      room.id === data.roomId
        ? { ...room, joined: false, messages: [...room.messages, "Left room."] }
        : room
    );
    setRooms(updatedRooms);
  });


  socket.on("new-message", (data: { roomId: string; message: string }) => {
    addMessage(data);
  });


  function addMessage(data: { roomId: string; message: string }) {
    const updatedRooms = rooms.map((room) =>
      room.id === data.roomId ? { ...room, messages: [...room.messages, data.message] } : room
    );
    setRooms(updatedRooms);
  }


  return (
    <>
      {connected ? (
        <div className="page-container">
          {rooms.map((room) => (
            <Chatroom key={room.id} roomData={room} addMessage={addMessage} />
          ))}
        </div>
      ) : (
        <div className="page-container">
          <button id="connect-btn" onClick={handleConnect}>
            Connect to Server
          </button>
        </div>
      )}
    </>
  );
}

export default App;
