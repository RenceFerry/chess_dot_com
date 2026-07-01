'use client';

import { useEffect } from 'react';
import { getSocket } from '@/_lib/socket';

const useSocket = () => {
  console.log('use socket')
  const socket = getSocket();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('connected: ', socket.id);
    })

    socket.on('connect_error', (err) => {
      console.log('connection failed: ', err.message);
    })
  }, [socket]);
  console.log('socket connected: ' + socket.connected)

  return socket;
};

export default useSocket;