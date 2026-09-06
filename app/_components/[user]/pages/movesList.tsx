'use client';

import { useRef, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import Button from '@/_components/wrappers/button';

import { gameMoves } from '@/_lib/test';

const MovesList = ({ close }: { close: (win: 'chats' | 'moves') => void }) => {
  const anchorDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (anchorDivRef.current) {
      anchorDivRef.current.scrollIntoView({
        behavior: 'instant'
      });
    }
  }, [])

  return (
    <div className='absolute bottom-30 right-10 h-90 w-75 rounded-lg bg-back4 z-30 border-fore2 border overflow-clip'>

      {/** title & close button */}
      <div className='w-full sticky z-30 bg-back4 left-0 top-0 flex flex-row justify-between items-center p-2'>
        {/** title */}
        <h1 className='text-lg font-semibold text-brown1 ml-3'>Moves List</h1>

        <Button bgspan='fore/20' click={() => close('moves')} title='close moves list' type='button' className='p-2 rounded-full hover:bg-back1 cursor-pointer'>
          <IoClose className='text-fore2 text-xl' />
        </Button>
      </div>

      {/** moves container */}
      <div className='flex-1 w-full flex flex-col flex-wrap overflow-x-scroll scrollbar px-3 py-2 min-h-0 min-w-0 h-80'>
        {
          gameMoves.map((m, i) => (
            <div key={i} className='flex flex-row gap-1 text-md mr-3'>
              <h1 className='font-semibold text-fore'>{m.move}.&nbsp;</h1>
              <h1 className='text-fore1'>{m.white}</h1>
              <h1 className='text-brown2'>{m.black}</h1>
            </div>
          ))
        }

        {/** scroll anchor */}
        <div ref={anchorDivRef} />
      </div>
    </div>
  )
}

export default MovesList;