import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import 'dotenv/config';
import * as cookie from 'cookie';
import type { CookiesType, SessionPayload } from '@/_lib/types';
import { jwtVerify } from 'jose';
import initializeEvents from '@/_utils/serverSocketEvents/events';

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

  //const userStatus = new Set<>

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
    
    initializeEvents(socket);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.name}`);
    });
  })

  global.io = io;

  server.listen(port, () => {
    console.log(">> Ready on port " + port);
  });
})