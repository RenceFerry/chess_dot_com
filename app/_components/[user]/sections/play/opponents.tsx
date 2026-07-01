'use client';

import React from 'react'
import Image from 'next/image';
import logo from '@/assets/demo.png';
import clsx from 'clsx';
import Button from '@/_components/wrappers/button';

type PlayersType = {
  name: string;
  status: 'online' | 'offline';
  playing: 'not playing' | 'playing';
  stream: 'not streaming' | 'streaming';
}

const Opponents = ({ players, viewProfile }: { players: PlayersType[]; viewProfile: (id: string) => void }) => {

  return (
    <div className='flex-1 flex w-full flex-col bg-back4 py-5 gap-4 overflow-auto no-scrollbar'>
      {
        players.map((player: PlayersType, i: number) => (
          <Button onClick={() => viewProfile('1')} bgspan='fore/20' key={i} className='mx-auto flex flex-row h-18 md:h-20 rounded-full w-[80%] max-w-200 bg-back px-1 relative shrink-0 transform transition-all ease-in-out duration-300 hover:scale-103 hover:brightness-125 cursor-pointer'>

            {/** online dot */}
            <div className={clsx('h-4 w-4 rounded-full absolute top-1 left-1', {
              'bg-green3': player.status === 'online',
              'bg-error3': player.status === 'offline',
            })}/>

            {/** profile pic */}
            <Image src={logo} alt='profile pic' className='h-16 md:h-18 md:w-18 w-16 rounded-full my-auto' />

            {/** player details */}
            <div className="flex-1 flex flex-row py-2 px-4 items-center justify-between ">

              {/** name */}
              <h1 className='text-md font-semibold md:text-xl'>{player.name}</h1>

              {/** playing and streaming */}
              <div className='text-fore1 text-sm md:text-lg'>
                <span className={clsx({
                  'text-error1': player.playing === 'not playing',
                  'text-green1': player.playing === 'playing'
                })}>
                  {player.playing}
                </span>
                &nbsp; | &nbsp;
                <span className={clsx({
                  'text-error1': player.stream === 'not streaming',
                  'text-green1': player.stream === 'streaming'
                })}>
                  {player.stream}
                </span>
                </div>
            </div>
          </Button>
        ))
      }
    </div>
  )
}

export default Opponents;