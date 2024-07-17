import express, { Request, Response } from 'express';
import cors, { CorsOptions } from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv';
import { inspirationalQuotes } from './quotes';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

const corsConfig : CorsOptions = { origin: "*" };

app.use(cors(corsConfig));
app.use(express.json());


// Create an HTTP server instance using the Express application.
const server = http.createServer(app);

// Start the server and listen on the specified port
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}.`));

// Create a new socket.io server instance with CORS configuration
const io = new Server(server, {
  cors: {
      origin: "*",          // Allow all origins
      methods: ["GET", "POST"], // Allow GET and POST methods
      credentials: true,    // Allow credentials
  },
});


// Whenever a client connects to the server, 
// the provided callback function is executed.
io.on("connection", (socket) => {

  // socket.emit is used to send an event to the client.
  socket.emit("connected", socket.id);
  socket.emit('new-quote', getRandomQuote());

  // Every 5 seconds, a new quote is sent to the client.
  setInterval(() => {
    socket.emit('new-quote', getRandomQuote());
  }, 3000);
});


// Function to get a random quote from the list of quotes
function getRandomQuote () {
  const index = Math.floor(Math.random() * inspirationalQuotes.length);
  return inspirationalQuotes[index];
}
