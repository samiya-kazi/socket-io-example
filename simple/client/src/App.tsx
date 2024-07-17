import { useEffect, useState } from 'react';
import './App.css';
import { IQuote } from './interfaces/quote.interface';
import { io } from 'socket.io-client';

const URL = import.meta.env.SERVER_URL ?? 'http://localhost:3000';


function App() {
  const [content, setContent] = useState<IQuote>({ quote: "", author: "" });
  
  useEffect(() => {
    const socket = io(URL);

    socket.on('new-quote', (data: IQuote) => setContent(data));

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
