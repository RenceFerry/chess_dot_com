'use client';

import { PlayersType } from "@/_lib/types";
import clsx from 'clsx';
import Image from 'next/image';
import Button from "@/_components/wrappers/button";

const Followers = ({ followers, viewProfile }: { followers: PlayersType[]; viewProfile: (id: string) => void }) => {
  return (
    <div className='flex-1 flex w-full flex-col bg-back3 py-5 gap-4 overflow-scroll no-scrollbar min-h-0 min-w-0'>
      {
        followers.map((follower: PlayersType, i: number) => (
          <Button onClick={() => viewProfile('1')} bgspan='fore/40' key={i} className='mx-auto flex flex-row h-18 md:h-20 rounded-full w-[80%] max-w-200 bg-back px-1 relative shrink-0 transform transition-all ease-in-out duration-300 hover:scale-103 hover:brightness-125 cursor-pointer'>

            {/** online dot */}
            <div className={clsx('h-4 w-4 rounded-full absolute top-1 left-1', {
              'bg-green3': follower.status === 'online',
              'bg-error3': follower.status === 'offline',
            })}/>

            {/** profile pic */}
            <Image unoptimized src={'https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male'} width={20} height={20} alt='avatar' className='h-16 md:h-18 md:w-18 w-16 rounded-full my-auto' />

            {/** follower details */}
            <div className="flex-1 flex flex-row py-2 px-4 items-center justify-between ">

              {/** name */}
              <h1 className='text-md font-semibold md:text-xl'>{follower.name}</h1>

              {/** playing and streaming */}
              <div className='text-fore1 text-sm md:text-lg'>
                <span className={clsx({
                  'text-error1': follower.playing === 'not playing',
                  'text-green1': follower.playing === 'playing'
                })}>
                  {follower.playing}
                </span>
                &nbsp; | &nbsp;
                <span className={clsx({
                  'text-error1': follower.stream === 'not streaming',
                  'text-green1': follower.stream === 'streaming'
                })}>
                  {follower.stream}
                </span>
                </div>
            </div>
          </Button>
        ))
      }
    </div>
  )
}

export default Followers;