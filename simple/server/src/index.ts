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


app.get('/', (req: Request, res: Response) => {
  res.json('Hello world!');
})

const server = http.createServer(app);

server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}.`));


const io = new Server(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
  },
});


io.on("connection", (socket) => {

  socket.emit("connected", socket.id);
  socket.emit('new-quote', getRandomQuote());

  setInterval(() => {
    socket.emit('new-quote', getRandomQuote());
  }, 3000);
});

function getRandomQuote () {
  const index = Math.floor(Math.random() * inspirationalQuotes.length);
  return inspirationalQuotes[index];
}
