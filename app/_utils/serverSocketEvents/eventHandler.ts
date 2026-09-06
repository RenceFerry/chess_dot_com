
import { Socket } from 'socket.io';

import { InvitationAcceptDataType, InvitationSendType, PlayersMapObjectType } from "@/_lib/types";
import redis from '@/_lib/redis';

export const handleHelloEvent = (data: string) => {
  console.log(`Received hello event from client: ${data}`);
};

export const handleInvitationSend = async (data: InvitationSendType, socket: Socket) => {
  const userId = socket.data.user.userId;
  const userName = socket.data.user.name;
  const roomName = data.id < userId ? `${data.id}::${userId}` : `${userId}::${data.id}`;

  // get user to invite
  const userStatus = global.userStatus;
  const io = global.io;
  //const invitations: Map<string, InvitationStateType> | undefined = global.invitations;
  if (!userStatus) return;
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
  // if (invitations.has(data.id)) {
  //   const invitationUser = invitations.get(data.id);
  //   if (!invitationUser) return;

  //   invitationUser?.map.set(socket.data.user.name, { ...data.data, fromId: socket.data.user.userId } );

  //   insertSort(invitationUser?.keys, socket.data.user.name, (a, b) => a.localeCompare(b, undefined, { numeric: true} ))
  // } else {
  //   invitations.set(data.id, {
  //     map: new Map([[socket.data.user.name, {
  //       ...data.data,
  //       fromId: socket.data.user.userId,
  //     }]]),
  //     keys: new Array(socket.data.user.name)
  //   })
  // }

  const fiveMinAgo = Date.now() - 1000 * 60 * 5;
  try 
  {
    // if user or reciever has 100 invitations or block invitation
    const sent = await redis.zCount(`invitation::sent::keys::${userId}`, `(${fiveMinAgo}`, '+inf');
    //const toUserRecieved = 400;
    const toUserRecieved = await redis.zCount(`invitation::received::keys::${data.id}`, `(${fiveMinAgo}`, '+inf');

    if (sent > 100) 
    {
      return socket.emit('invitation:blocked', 'Maximum number of sent invitations was reached (100)')
    } 
    else if (toUserRecieved > 100)
    { 
      return socket.emit('invitation:blocked', data.name + ' has reached maximum number of received invitations.')
    }
    
    // store invitation in redis
    // for sent invitations
    const pipeline = redis.multi();
    pipeline.hSetEx(`invitation::sent::${userId}`, {
      [data.name]: JSON.stringify({
        fromName: userName,
        fromId: userId,
        toName: data.name,
        toId: data.id,
        ...data.data
      })
    }, {
      expiration: { type: 'EX', value: 60 * 5}
    })
    // store keys sent
    .zAdd(`invitation::sent::keys::${userId}`,{
      score: Date.now() + 1000 * 60 * 5,
      value: data.name,
    })
    // set new expiration 
    .expire(`invitation::sent::keys::${userId}`, 60 * 5)
    // for received invitations
    .hSetEx(`invitation::received::${data.id}`, {
      [userName]: JSON.stringify({
        fromName: userName,
        fromId: userId,
        toName: data.name,
        toId: data.id,
        ...data.data
      })
    }, {
      expiration: { type: 'EX', value: 60 * 5}
    })
    // store received keys
    .zAdd(`invitation::received::keys::${data.id}`,{
      score: Date.now() + 1000 * 60 * 5,
      value: userName,
    })
    // set new expiration 
    .expire(`invitation::received::keys::${data.id}`, 60 * 5)

    // execute redis 
    await pipeline.exec();
  } 
  catch (e) 
  {
    console.log('server error')
  }

  // send invitation if online
  if (user) 
  {
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
    deleteInvitationAndKeys(data.fromId, data.fromName, data.toId, data.toName);

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
  deleteInvitationAndKeys(data.fromId, data.fromName, data.toId, data.toName);

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
    deleteInvitationAndKeys(data.fromId, data.fromName, data.toId, data.toName);

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
  const user: PlayersMapObjectType | undefined | null = usersStatus?.get(data.toId) || null;
  const me: PlayersMapObjectType | undefined | null = userStatus?.get(socket.data.user.userId);

  // delete invitation in temp storage
  deleteInvitationAndKeys(data.fromId, data.fromName, data.toId, data.toName);

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
async function deleteInvitationAndKeys(fromId: string, fromName: string, toId: string, toName: string) {

  try {
    // redis pipeline
    const pipeline = redis.multi();
    // delete hash sent
    pipeline.hDel(`invitation::sent::${fromId}`, toName)
    // delete received hash
    .hDel(`invitation::received::${toId}`, fromName)
    // delete received keys
    .zRem(`invitation::received::keys::${toId}`, fromName)
    // delete sent keys
    .zRem(`invitation::sent::keys::${fromId}`, toName);

    // run pipline
    await pipeline.exec();
  } catch (e) {
    console.log('server error');
  }
}