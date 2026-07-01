'use client';

import { useRef } from 'react'
import logo from '@/assets/demo.png';
import Image from 'next/image';
import Board from '@/_components/[user]/pages/board';
import chessPieces from '@/_lib/chessPieces';

const WithoutStream = () => {
  const boardContainerRef = useRef(null);

  const Q = chessPieces['q'];
  const P = chessPieces['p'];
  const N = chessPieces['n'];

  return (
    <div className='flex flex-col flex-1 w-full justify-around items-center min-h-0 min-w-0 2xl:flex-row-reverse z-30 gap-2 font-semibold'>
      {/* opponent */}
        <div className='flex px-5 flex-row justify-end items-center max-w-full min-w-0 min-h-0 gap-5 self-end 2xl:self-start flex-wrap-reverse 2xl:flex-col-reverse z-10'>

          {/** captured pieces */}
          <div className='flex flex-row justify-start gap-3 bg-brown5 text-fore1 p-1 text-md md:text-lg rounded-lg 2xl:self-start'>
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

          {/** opponent details */}
          <div className='flex flex-row justify-start items-center min-h-0 gap-10'>
            {/** time */}
            <div className='flex flex-col items-end bg-green2 px-3 py-1 rounded-lg'>
              <h2 className='text-back2 font-bold text-md md:text-lg'>(10:00)</h2>
            </div>

            {/** name and elo */}
            <div className='flex flex-row gap-5 items-center'>
              <h1 className='text-fore1 font-normal text-md md:text-lg truncate max-w-56'>(2345) John Doe tttttttttttttttttttttttttttttttttttttttttteeeeeeeeeeeeeeeeeeeeeeeee</h1>
              <Image src={logo} alt='profile pic' className='h-12 w-12 rounded-full'/>
            </div>
          </div>

        </div>

        {/** chess board */}
        <div ref={boardContainerRef} className='flex flex-2 w-full justify-center items-center 2xl:h-full min-h-0 min-w-0'>
          <Board containerRef={boardContainerRef} />
        </div>

        {/** player */}
        <div className='flex p-5 flex-row justify-start items-center max-w-full min-w-0 min-h-0 gap-5 self-start flex-wrap-reverse 2xl:flex-wrap 2xl:flex-col z-10 text-md md:text-lg'>

          <div className='flex flex-row justify-start items-center min-h-0 gap-10'>
            {/** name and elo */}
            <div className='flex flex-row items-center gap-5'>
              <Image src={logo} alt='profile pic' className='h-12 w-12 rounded-full'/>
              <h1 className='text-fore1 font-normal truncate max-w-56'>(2345) John Woodsssssssssssssssssssssssssssssssssssssssssss</h1>
            </div>

            {/** time */}
            <div className='flex flex-col items-end bg-green2 rounded-lg px-3 py-1'>
              <h2 className='text-back2 font-bold'>(10:00)</h2>
            </div>
          </div>

          {/** captured pieces */}
          <div className='flex flex-row justify-start gap-3 bg-brown1 text-back2 p-1 rounded-lg 2xl:self-start'>
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

        </div>
    </div>
  )
}

export default WithoutStream;