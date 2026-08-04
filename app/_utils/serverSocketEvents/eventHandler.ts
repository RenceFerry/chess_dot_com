import { insertSort } from './../helpers';
import { Socket } from 'socket.io';

import { InvitationAcceptDataType, InvitationSendType, InvitationStateType, PlayersMapObjectType } from "@/_lib/types";

export const handleHelloEvent = (data: string) => {
  console.log(`Received hello event from client: ${data}`);
};

export const handleInvitationSend = async (data: InvitationSendType, socket: Socket) => {
  console.log('received invitation:', data);
  const userId = socket.data.user.userId;
  const roomName = data.id < userId ? `${data.id}::${userId}` : `${userId}::${data.id}`;

  // get user to invite
  const userStatus = global.userStatus;
  const io = global.io;
  const invitations: Map<string, InvitationStateType> | undefined = global.invitations;
  if (!userStatus || !invitations) return;
  const user: PlayersMapObjectType | undefined = userStatus.get(data.id);

  // if user is playing with this person block the invitation
  const sockets = await io?.in(roomName).fetchSockets();
  console.log(roomName, sockets);
  if (sockets) {
    for (const s of sockets) {
      console.log(socket.data.user)
      if (s.data.user.userId === userId) {
        return socket.emit('invitation:playing', data);
      }
    }
  }

  // set the invitation in memory
  if (invitations.has(data.id)) {
    const invitationUser = invitations.get(data.id);
    if (!invitationUser) return;

    invitationUser?.map.set(socket.data.user.name, { ...data.data, fromId: socket.data.user.userId } );

    insertSort(invitationUser?.keys, socket.data.user.name, (a, b) => a.localeCompare(b, undefined, { numeric: true} ))
  } else {
    invitations.set(data.id, {
      map: new Map([[socket.data.user.name, {
        ...data.data,
        fromId: socket.data.user.userId,
      }]]),
      keys: new Array(socket.data.user.name)
    })
  }

  // send invitation if online
  if (user) {
    for (const [key] of user.socket) {
      socket.to(key).emit('invitation:send', { 
        fromId: socket.data.user.userId, 
        fromName: socket.data.user.name, 
        toId:  data.id,
        toName: data.name,
        data: {...data.data}, 
      })
    }
  }
  
  // cofirm sent
  socket.emit('invitation:sent', data.name);
};

export const handleInvitationAccept = (data: InvitationAcceptDataType, socket: Socket) => {
  console.log(data);
  // get userStatus
  const usersStatus = global.userStatus;
  const user: PlayersMapObjectType | undefined | null = usersStatus?.get(data.fromId) || null;
  if (!usersStatus || !user) {
    deleteInvitationAndKeys(data.toId, data.fromName);

    return socket.emit('invitation:cancel', data);
  }

  for (const [key] of user.socket) {
    socket.to(key).emit('invitation:accept', data);
  }
};

export const handleInvitationReject = (data: InvitationAcceptDataType, socket: Socket) => {

  // get userStatus
  const usersStatus = global.userStatus;
  const user: PlayersMapObjectType | undefined | null = usersStatus?.get(data.fromId) || null;

  // delete invitation in temp storage
  deleteInvitationAndKeys(data.toId, data.fromName);

  if (user) {
    for (const [key] of user.socket) {
      socket.to(key).emit('invitation:reject', data);
    }
  }
};

export const handleInvitationConfirm = (data: InvitationAcceptDataType, socket: Socket) => {
  console.log(data.data);
  // get userStatus
  const usersStatus = global.userStatus;
  const user: PlayersMapObjectType | undefined | null = usersStatus?.get(data.toId) || null;
  const me: PlayersMapObjectType | undefined | null = userStatus?.get(socket.data.user.userId);

  if (!usersStatus || !user) {
    deleteInvitationAndKeys(data.toId, data.fromName);

    return socket.emit('invitation:cancel', data);
  }

  for (const [key] of user.socket) {
    socket.to(key).emit('invitation:confirm', data);
  }

  if (me) {
    for (const [key] of me.socket) {
      socket.to(key).emit('invitation:closeConfirm', data);
    }
  }
};

export const handleInvitationCancel = (data: InvitationAcceptDataType, socket: Socket) => {

  // get userStatus
  const usersStatus = global.userStatus;
  const user: PlayersMapObjectType | undefined | null = usersStatus?.get(data.toUserId || data.toId) || null;
  const me: PlayersMapObjectType | undefined | null = userStatus?.get(socket.data.user.userId);

  // delete invitation in temp storage
  deleteInvitationAndKeys(data.toId, data.fromName);

  if (user) {
    for (const [key] of user.socket) {
      socket.to(key).emit('invitation:cancel', data);
    }
  }

  if (me) {
    for (const [key] of me.socket) {
      socket.to(key).emit('invitation:closeConfirm', data);
    }
  }
};

export const handleRoomJoin = (room: string, socket: Socket) => {

  // const io = global.io;
  // if (!io) return;

  socket.join(room);
  socket.to(room).emit('room:joined');
};

export const handleRoomLeave = (room: string, socket: Socket) =>  {
  socket.leave(room);
}

export const handleRoomHello = (room: string, socket: Socket) => {
  socket.to(room).emit('room:hello');
};

// helper fns
function deleteInvitationAndKeys(id: string, name: string): void {
  const invitations = global.invitations;

  const userInvitation: InvitationStateType | null = invitations?.get(id) || null;

  if (userInvitation) {
    console.log('b d',userInvitation.map);
    userInvitation.map.delete(name);
    userInvitation.keys = userInvitation.keys.filter(k => k !== name);
    console.log('a d', userInvitation.map);
  }
}