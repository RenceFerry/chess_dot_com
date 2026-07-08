import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import 'dotenv/config';
import * as cookie from 'cookie';
import type { PlayersMapObjectType, SessionPayload, StreamCardsInfoType } from '@/_lib/types';
import { jwtVerify } from 'jose';
import initializeEvents from '@/_utils/serverSocketEvents/events';
import { streams } from '@/_lib/test';
import { insertSort } from '@/_utils/helpers';

const port = Number(process.env.PORT) || 3000;
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parseUrl = parse(req.url!, true);
    handle(req, res, parseUrl);
  });

  const userStatus = new Map<string, PlayersMapObjectType>();
  const streamsInfos = new Map<string, StreamCardsInfoType>();
  const streamsKeys = new Array<string>();

  // temporarily populate streams data
  streams.forEach((stream) => {
    const key = stream.p1 + '::' + stream.p2 + '::' + stream.no;
    streamsInfos.set(key, {
      no: stream.no,
      p1Elo: stream.p1Elo,
      p2Elo: stream.p2Elo,
      p1Name: stream.p1,
      p2Name: stream.p2,
      mode: 'Blitz',
      p1Img: null,
      p2Img: null
    })
    insertSort(streamsKeys, key, (a, b) => a.localeCompare(b, undefined, { numeric: true}))
  })

  // initialize socket.io server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  // io middleware to parse cookies and verify session
  io.use(async (socket, next) => {
    const rawCookie = socket.handshake.headers.cookie;
    
    if (!rawCookie) return next(new Error('No cookie found'));
    
    const cookies = cookie.parseCookie(rawCookie);

    if (!cookies.session) return next(new Error('No session cookie found'));
    const session = cookies.session;

    try {
      const payload = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
      })

      socket.data.user = payload.payload as SessionPayload;

    } catch (error) {
      return next(new Error('Invalid session'));
    }

    next();
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.name}`);

    userStatus.set('e11f71b6-8fd3-4eee-bc28-b622fe7e2ab2', {
      userId: 'e11f71b6-8fd3-4eee-bc28-b622fe7e2ab2',
      name: 'Clarence Ferry',
      online: true,
      socket: new Map([[socket.id, {
        playing: true,
        streaming: true,
        socket: socket
      }]])
    });

    // store user status in the map
    if (userStatus.has(socket.data.user.userId)) {
      const user = userStatus.get(socket.data.user.userId);
      user?.socket.set(socket.id, {
        socket,
        playing: false,
        streaming: false
      });
    } else {
      userStatus.set(socket.data.user.userId, {
        userId: socket.data.user.userId,
        name: socket.data.user.name,
        online: true,
        socket: new Map([[socket.id, {
          socket,
          playing: false,
          streaming: false,
        }]])
      })
    }
    
    initializeEvents(socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.name}`);
      const user = userStatus.get(socket.data.user.userId);

      // remove the socket from the user's socket map
      // if the user has no more sockets, remove the user from the map
      if (user) {
        user.socket.delete(socket.id);
        if (user.socket.size === 0) {
          userStatus.delete(socket.data.user.userId);
        }
      }
    });
  })

  global.io = io;
  global.userStatus = userStatus;
  global.streamsInfos = streamsInfos;
  global.streamsKeys = streamsKeys;

  server.listen(port, () => {
    console.log(">> Ready on port " + port);
  });
})