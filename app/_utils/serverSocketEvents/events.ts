import { Socket } from "socket.io";
import { handleHelloEvent } from "./eventHandler";

const initializeEvents = (socket: Socket) => {
  socket.on('hello', (data) => {
    console.log(data);
  });
}

export default initializeEvents;