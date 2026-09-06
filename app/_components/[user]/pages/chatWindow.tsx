'use client';

import { IoClose } from "react-icons/io5";
import clsx from "clsx";
import React, { useRef, useEffect } from 'react'
import Button from '@/_components/wrappers/button';

import { message } from '@/_lib/test';

const ChatWindow = ({ close }: { close: (win: 'chats' | 'moves') => void }) => {
  const scrollDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollDivRef.current) {
      scrollDivRef.current.scrollIntoView({
        behavior: 'instant',
      })
    }
  })

  return (
    <div className='absolute bottom-30 left-10 h-90 w-75 rounded-lg bg-back4 z-30 border border-fore2 flex flex-col overflow-y-scroll scrollbar gap-0.5 pb-3'>

      {/** title & close button */}
      <div className='w-full sticky z-30 bg-back4 left-0 top-0 flex flex-row justify-between items-center p-2'>
        {/** title */}
        <h1 className='text-lg font-semibold text-brown1 ml-3'>
          Chats
        </h1>

        <Button bgspan='fore/20' click={() => close('chats')} title='close chat window' type='button' className='p-2 rounded-full hover:bg-back1 cursor-pointer'>
          <IoClose className='text-fore2 text-xl' />
        </Button>
      </div>


      { //messages
        message.map((m, i) => (
          <React.Fragment key={i}>
            { //name
              message[i - 1]?.sender !== m.sender && 
              <h2 className={clsx('text-xs mt-2 text-fore1 mx-3', {
                'self-start': m.sender === 'opponent',
                'self-end': m.sender === 'player'
              })}>
                {m.sender === 'opponent' ? 'Opponent' : 'You'}
              </h2>
            }

            <div className={clsx('max-w-[75%] p-2 text-fore1 text-md relative mx-3', {
              'self-start bg-back1': m.sender === 'opponent',
              'self-end bg-brown4': m.sender === 'player',
              'rounded-t-lg': message[i - 1]?.sender !== m.sender,
              'rounded-br-lg': m.sender === 'opponent',
              'rounded-bl-lg': m.sender === 'player',
            })}>
              {m.text}
            </div>
          </React.Fragment>
        ))
      }

      <div ref={scrollDivRef} />
    </div>
  )
}

export default ChatWindow;