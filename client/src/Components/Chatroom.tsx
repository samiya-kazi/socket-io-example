import { FormEvent, useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";

function Chatroom({
  roomData,
  addMessage,
}: {
  roomData: { id: string; name: string; joined: boolean; messages: string[] };
  addMessage: (data: { roomId: string; message: string }) => void;
}) {
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.lastElementChild?.scrollIntoView()
  }, [roomData])

  function handleJoinRoom() {
    socket.emit("join-room", { roomId: roomData.id });
  }

  function handleLeaveRoom() {
    socket.emit("leave-room", { roomId: roomData.id });
  }

  function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    socket.emit("send-message", { roomId: roomData.id, message });
    addMessage({ roomId: roomData.id, message });
    setMessage("");
  }

  return (
    <div className="room-container">
      <h2>{roomData.name}</h2>
      {roomData.joined ? (
        <button className="room-btn leave-btn" onClick={handleLeaveRoom}>
          Leave Room
        </button>
      ) : (
        <button className="room-btn join-btn" onClick={handleJoinRoom}>
          Join Room
        </button>
      )}
      <div className="chat-container" ref={chatRef}>
        {roomData.messages.map((message, index) => (
          <div key={`message-${roomData.id}-${index}`} className="message"> 
            {message}
          </div>
        ))}
      </div>

        <form className='input-form' onSubmit={handleSendMessage}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button disabled={message.length === 0}>Send</button>
        </form>

    </div>
  );
}

export default Chatroom;
