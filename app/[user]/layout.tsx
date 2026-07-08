'use client';

import React, { useEffect } from 'react'
import TopSection from '@/_components/[user]/sections/topSection';
import { UserDetailsProvider } from '@/_lib/context/userDetailsContext';
import useSocket from '@/_lib/hooks/useSocket';

const Page = ({ children }: {
  children: React.ReactNode
}) => {
  const socket = useSocket();

  useEffect(() => {
    socket.emit('hello', { message: 'Hello from client!' });
    console.log('hello socket');

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [socket]);

  return (
    <UserDetailsProvider>
    <div className='h-dvh w-dvw min-w-0 min-h-0 flex flex-col'>

      {/** topsection */}
      <TopSection />

      {/** everything else */}
      <div className='w-full flex-1 min-w-0 min-h-0'>
        {children}
      </div>
    </div>
    </UserDetailsProvider>
  )
}

export default Page;