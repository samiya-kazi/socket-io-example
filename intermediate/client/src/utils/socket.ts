import { io } from 'socket.io-client';

const URL = import.meta.env.SERVER_URL ?? 'http://localhost:3000';

// disconnect is called to manually keep the socket connection disconnected until we turn it on
// this is not needed if you want to connect immediately when someone comes to your application
export const socket = io(URL).disconnect();