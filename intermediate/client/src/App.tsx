import { useState } from "react";
import "./App.css";
import { socket } from "./utils/socket";
import Chatroom from "./Components/Chatroom";
import { IRoom } from "./interfaces/room.interface";
import { IMessage } from "./interfaces/message.interface";

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
  const [username, setUsername] = useState<string>("");

  function handleConnect() {
    socket.connect();
  }

  socket.on("me", () => {
    setConnected(true);
  });

  socket.on("join-room-success", (data: { roomId: string }) => {
    const updatedRooms = rooms.map((room) =>
      room.id === data.roomId
        ? {
            ...room,
            joined: true,
            messages: [
              ...room.messages,
              {
                content: "You joined the room.",
                sender: "system",
                timestamp: new Date(),
                type: "join",
              },
            ],
          }
        : room
    );
    setRooms(updatedRooms);
  });

  socket.on("leave-room-success", (data: { roomId: string }) => {
    const updatedRooms = rooms.map((room) =>
      room.id === data.roomId
        ? {
            ...room,
            joined: false,
            messages: [
              ...room.messages,
              {
                content: "You left the room.",
                sender: "system",
                timestamp: new Date(),
                type: "leave",
              },
            ],
          }
        : room
    );
    setRooms(updatedRooms);
  });

  socket.on("new-message", (data: { roomId: string; message: IMessage }) => {
    addMessage(data);
  });

  function addMessage(data: { roomId: string; message: IMessage }) {
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
            <Chatroom key={room.id} roomData={room} addMessage={addMessage} username={username} />
          ))}
        </div>
      ) : (
        <div className="page-container connect-screen">
          <div>
            <div className="username-field">
              <label htmlFor="username">Enter Username </label>
              <input
                className="username-field"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button id="connect-btn" onClick={handleConnect} disabled={username.length === 0}>
              Connect to Server
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
