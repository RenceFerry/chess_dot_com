import { Socket } from "socket.io";
import { handleHelloEvent, handleInvitationSend, handleInvitationAccept, handleInvitationConfirm, handleRoomJoin, handleRoomHello, handleInvitationReject, handleInvitationCancel, handleRoomLeave } from "./eventHandler";

const initializeEvents = (socket: Socket) => {

  // hello
  socket.on('hello', handleHelloEvent);

  // invitation: send
  socket.on('invitation:send', (data) => handleInvitationSend(data, socket));

  // invitation: accept
  socket.on('invitation:accept', (data) => handleInvitationAccept(data, socket));

  // invitation: reject
  socket.on('invitation:reject', (data) => handleInvitationReject(data, socket))

  // invitation: confirm
  socket.on('invitation:confirm', (data) => handleInvitationConfirm(data, socket))

  // invitatio: cancel
  socket.on('invitation:cancel', (data) => handleInvitationCancel(data, socket));

  // join room for playing
  socket.on('room:join', (data) => handleRoomJoin(data, socket))
  // leave room
  socket.on('room:leave', (data) => handleRoomLeave(data, socket));
  // for confirming connection
  socket.on('room:hello', (data) => handleRoomHello(data, socket))
}

export default initializeEvents;