import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    console.log('get socket again');
    socket = io(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', {
      withCredentials: true,
    });
  }

  console.log('get socket');
  
  return socket;
}