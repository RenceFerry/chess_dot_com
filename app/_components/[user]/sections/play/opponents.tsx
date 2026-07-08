'use client';

import React from 'react'
import Image from 'next/image';
import logo from '@/assets/demo.png';
import clsx from 'clsx';
import Button from '@/_components/wrappers/button';
import type { PlayersType } from '@/_lib/types';
import { PlayersSkeleton } from '@/_components/skeletons';

const Opponents = ({ players, viewProfile }: {
  players: {
    follow: PlayersType[]; 
    nonFollow: PlayersType[];
  };
  viewProfile: (id: string) => void;
}) => {
  const playersArr = [...players?.follow || [], ...players?.nonFollow || []];
  console.log('rendering opponents', playersArr);

  return (
    <>
      { 
        playersArr.map((player: PlayersType, i: number) => (
          <Button onClick={() => viewProfile(player.id)} bgspan='fore/20' key={i} className='mx-auto flex flex-row h-18 md:h-20 rounded-full w-[80%] max-w-200 bg-back px-1 relative shrink-0 transform transition-all ease-in-out duration-300 hover:scale-103 hover:brightness-125 cursor-pointer'>

            {/** online dot */}
            <div className={clsx('h-4 w-4 rounded-full absolute top-1 left-1', {
              'bg-green3': player.online,
              'bg-error3': !player.online,
            })}/>

            {/** profile pic */}
            <Image src={player.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} alt='profile pic' className='h-16 md:h-18 md:w-18 w-16 rounded-full my-auto' width={90} height={90} loading='lazy' quality={75} />

            {/** player details */}
            <div className="flex-1 flex flex-row py-2 px-4 items-center justify-between ">

              {/** name */}
              <h1 className='text-md font-semibold md:text-xl'>{player.name}</h1>

              {/** playing and streaming */}
              <div className='text-fore1 text-sm md:text-lg'>
                <span className={clsx({
                  'text-error1': !player.playing,
                  'text-green1': player.playing
                })}>
                  {player.playing ? 'Playing' : 'Not Playing'}
                </span>
                &nbsp; | &nbsp;
                <span className={clsx({
                  'text-error1': !player.streaming,
                  'text-green1': player.streaming
                })}>
                  {player.streaming ? 'Streaming' : 'Not Streaming'}
                </span>
                </div>
            </div>
          </Button>
        ))
      }
    </>
  )
}

export default Opponents;