//import { Socket } from 'socket.io';

export const handleHelloEvent = (data: string) => {
  console.log(`Received hello event from client: ${data}`);
}