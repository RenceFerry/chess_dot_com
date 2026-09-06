'use client';

import { PlayersType } from "@/_lib/types";
import clsx from 'clsx';
import Image from 'next/image';
import Button from "@/_components/wrappers/button";

const Followers = ({ players, viewProfile }: { players: PlayersType[]; viewProfile: (id: string) => void }) => {

  return (
    <>
      {
        players.map((player: PlayersType, i: number) => (
          <Button click={() => viewProfile(player.id)} bgspan='fore/40' key={i} className='mx-auto flex flex-row h-18 md:h-20 rounded-full w-[90%] md:w-8/10 max-w-200 bg-back px-1 relative shrink-0 transform transition-all ease-in-out duration-300 hover:scale-103 hover:brightness-125 cursor-pointer'>

            {/** online dot */}
            <div className={clsx('h-4 w-4 rounded-full absolute top-1 left-1', {
              'bg-green3': player.online,
              'bg-error3': !player.online,
            })}/>

            {/** profile pic */}
            <Image unoptimized={false} src={player.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={72} height={72} alt='avatar' className='h-16 md:h-18 md:w-18 w-16 rounded-full my-auto' />

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

export default Followers;