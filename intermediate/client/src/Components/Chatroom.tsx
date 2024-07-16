import { FormEvent, useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import { IMessage } from "../interfaces/message.interface";

const messageCSS: {[key: string]: string} = {
  join: "message join-message",
  leave: "message leave-message",
  basic: "message"
}

function Chatroom({
  roomData,
  addMessage,
  username
}: {
  roomData: { id: string; name: string; joined: boolean; messages: IMessage[] };
  addMessage: (data: { roomId: string; message: IMessage }) => void;
  username: string;
}) {
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.lastElementChild?.scrollIntoView()
  }, [roomData])

  function handleJoinRoom() {
    socket.emit("join-room", { roomId: roomData.id, username });
  }

  function handleLeaveRoom() {
    socket.emit("leave-room", { roomId: roomData.id, username });
  }

  function handleSendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newMessage = { content: message, sender: username, timestamp: new Date(), type: "basic"};
    socket.emit("send-message", { roomId: roomData.id, message: newMessage });

    addMessage({ roomId: roomData.id, message: newMessage });
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
          <div 
            key={`message-${roomData.id}-${index}`} 
            className={messageCSS[message.type] ?? "message"}
          > 
            {message.sender !== 'system' && <b>{message.sender}: </b>}
            {message.content}
          </div>
        ))}
      </div>

        <form className='input-form' onSubmit={handleSendMessage}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} disabled={!roomData.joined} />
          <button disabled={message.length === 0}>Send</button>
        </form>

    </div>
  );
}

export default Chatroom;
