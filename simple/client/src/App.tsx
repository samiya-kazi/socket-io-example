import { useEffect, useState } from 'react';
import './App.css';
import { IQuote } from './interfaces/quote.interface';
import { io } from 'socket.io-client';

const URL = import.meta.env.SERVER_URL ?? 'http://localhost:3000';


function App() {
  const [content, setContent] = useState<IQuote>({ quote: "", author: "" });
  
  // When this component mounts, we will establish a socket connection to the server
  useEffect(() => {
    const socket = io(URL);

    // Listen for the "connected" event and log the received data
    socket.on("connected", (data: string) => console.log(data));

    // Listen for the "new-quote" event and update the content state
    socket.on('new-quote', (data: IQuote) => setContent(data));

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    }
  }, []);


  return (
    <div className="page-container">
      <div className="content">
        <div className="quote">{content.quote}</div>
        <div className="author">{content.author}</div>
      </div>
    </div>
  )
}

export default App
