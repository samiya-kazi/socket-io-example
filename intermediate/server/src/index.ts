import express, { Request, Response } from 'express';
import cors, { CorsOptions } from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv';
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

  socket.emit("me", socket.id);

  socket.on("join-room", (data: { roomId: string }) => {
    socket.join(data.roomId);
    socket.emit('join-room-success', { roomId: data.roomId });
  });

  socket.on("leave-room", (data: { roomId: string }) => {
    socket.emit('leave-room-success', { roomId: data.roomId });
    socket.leave(data.roomId);
  });

  socket.on("send-message", (data: { roomId: string, message: string }) => {
    socket.to(data.roomId).emit('new-message', data);
  });

});