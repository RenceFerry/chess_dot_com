'use client';

import { useRef } from 'react'
import Board from './board';
import chessPieces from '@/_lib/chessPieces';
import StreamCard from '@/_components/[user]/pages/streamCard';

const WithStream = ({ stream = false }: { stream?: boolean} ) => {
  const boardContainerRef = useRef(null);

  const Q = chessPieces['q'];
  const P = chessPieces['p'];
  const N = chessPieces['n'];

  return (
    <div className='flex flex-col w-full flex-1 md:flex-row overflow-clip min-h-0 min-w-0 font-semibold'>

      {/** stream camera */}
      <div className='w-full px-3 flex flex-row md:flex-col-reverse gap-5 items-center justify-center md:h-full md:w-fit md:pl-5 xl:pl-10 min-h-0 min-w-0'>

        {/** player stream feed container */}
        <StreamCard plDetails={{ name: 'Jane Smith', elo: 2180, white: true }} />

        {/** opponent stream feed container */}
        <StreamCard plDetails={{ name: 'John Doe', elo: 2345, white: false }} />
        
      </div>

      {/** board container*/}
      <div className='flex flex-1 flex-col w-full md:h-full min-h-0 min-w-0 pt-2'>

        {/** opponent captured & time */}
        <div className='w-full flex flex-row justify-end px-3 items-end gap-5 text-md md:text-lg md:justify-start'>
          {/** captured pieces */}
          <div className='flex flex-row justify-start gap-3 bg-brown5 text-fore1 p-1 rounded-lg'>
            <div className='flex flex-row items-center gap-1'>
              <Q/>
              <h1>1</h1>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <P/>
              <h1>5</h1>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <N/>
              <h1>2</h1>
            </div>
          </div>

          {/** time */}
          <div className='flex flex-col items-end bg-green2 rounded-lg px-3 py-1'>
            <h2 className='text-back2 font-bold'>(10:00)</h2>
          </div>
        </div>

        {/** chess board */}
        <div ref={boardContainerRef} className='flex-1 flex justify-center items-center w-full min-h-0 min-w-0'>
          <Board stream={stream} containerRef={boardContainerRef} />
        </div>

        {/** player captured & time */}
        <div className='w-full flex flex-row justify-start px-3 items-start gap-5 text-md md:text-lg'>
          {/** captured pieces */}
          <div className='flex flex-row justify-start gap-3 bg-brown1 text-back2 p-1 rounded-lg'>
            <div className='flex flex-row items-center gap-1'>
              <Q/>
              <h1>1</h1>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <P/>
              <h1>5</h1>
            </div>
            <div className='flex flex-row items-center gap-1'>
              <N/>
              <h1>2</h1>
            </div>
          </div>

          {/** time */}
          <div className='flex flex-col items-end bg-green2 rounded-lg px-3 py-1'>
            <h2 className='text-back2 font-bold'>(10:00)</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithStream;