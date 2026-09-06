'use client';

import { IoClose } from 'react-icons/io5';
import Button from './wrappers/button';

export const ProfileCardSkeleton = ({ close }: { close: () => void }) => {
  return (
    <div className='absolute z-100 top-0 left-0 justify-center items-center w-full h-full flex backdrop-blur-xs bg-black/40 rounded-[inherit] min-w-0'>

      {/** the actual card */}
      <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-64 w-[90%] md:w-65/100 max-w-150'>

        {/** title & close button */}
        <div className='w-full flex flex-row p-3 justify-end'>
          {/** close button */}
          <Button bgspan='fore/20' click={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
            <IoClose className='text-fore2 text-xl' />
          </Button>
        </div>

        {/** content */
          <div className='flex flex-col p-3 pb-10 justify-start items-center w-full gap-2 animate-pulse'>

            {/** profile details container */}
            <div className='w-full p-2 flex flex-row gap-2 justify-center'>

              {/** avatar container */}
              <div className='aspect-square flex-1'>
                <div className='w-full aspect-square bg-back rounded-full' />
              </div>

              {/** details */}
              <div className='flex flex-col flex-1 px-2 justify-center items-start md:flex-2 gap-2'>
                <div className='w-full h-8 font-semibold text-fore1 text-md md:text-2xl bg-back rounded-full' />
                <div className='w-full h-8 font-semibold text-fore1 text-md md:text-2xl bg-back rounded-full' />
                <div className='w-full h-8 font-semibold text-fore1 text-md md:text-2xl bg-back rounded-full' />

                {/** follow */}
                <div className='grid items-center rounded-lg bg-back2 mt-3 py-1 px-5 font-semibold text-back4 hover:bg-back w-20 h-10 ' />
              </div>
            </div>

            {/** status */}
            <div className='flex flex-row justify-center items-center h-8 rounded-full text-md md:text-lg gap-2 w-40 bg-back' />

            {/** options */}
            <div className='flex flex-col items-center gap-2 w-full mt-3'>
              
              {/** invite button */}
              <div className='bg-back2 h-12 text-back2 font-semibold p-2 w-[70%] min-w-64 max-w-80 rounded-xl hover:bg-back' />

              {/** watch stream button */}
              <div className='bg-back2 h-12 text-back2 font-semibold p-2 w-[70%] min-w-64 max-w-80 rounded-xl hover:bg-back' />
            </div>

          </div>
        }
      </div>
    </div>
  )
}

export const ProfileDetSkeleton = () => {
  return (
    <>
      {/** profile pic */}
      <div className='h-34 w-34 sm:w-64 sm:h-64 md:h-84 md:w-84 rounded-full object-cover overflow-hidden relative bg-back1 animate-pulse' />

      {/** user details */}
      <div className='flex flex-col items-center justify-center gap-4 md:h-full p-4'>

        <div className='text-brown1 text-lg font-semibold md:text-3xl bg-back1 animate-pulse rounded-full h-6 w-40'></div>

        <div className='text-brown1 text-lg font-semibold md:text-3xl bg-back1 animate-pulse rounded-full h-6 w-40'></div>

        <div className='text-brown1 text-lg font-semibold md:text-3xl bg-back1 animate-pulse rounded-full h-6 w-40'></div>
      </div>
    </>
  )
}

export const PlayersSkeleton = () => {
  return (
    <>
      {
        Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='mx-auto flex flex-row h-18 md:h-20 rounded-full w-95/100 md:w-[80%] max-w-200 bg-back px-1 relative shrink-0 transform transition-all ease-in-out duration-300 hover:scale-103 hover:brightness-125 cursor-pointer animate-pulse'>

            {/** profile pic */}
            <div className='h-16 md:h-18 md:w-18 w-16 rounded-full my-auto bg-back2' />

            {/** player details */}
            <div className="flex-1 flex flex-row py-2 px-4 items-center justify-between ">

              {/** name */}
              <div className='text-md font-semibold md:text-xl bg-back3 rounded-full h-8 w-[30%]' />

              {/** playing and streaming */}
              <div className='text-fore1 text-sm md:text-lg bg-back2 h-6 w-[30%] rounded-full'/>
            </div>
          </div>
        ))
      }
    </>
  )
}

export const StreamCardsSkeleton = () => {
  return (
    <>
      {
        Array.from({length: 6}).map((_, i: number) => (
          <div key={i} className='flex mx-auto w-[90%] max-w-200 h-80 rounded-xl flex-col bg-back overflow-hidden transition duration-150 hover:scale-103 ease-in-out transform cursor-pointer hover:brightness-125 animate-pulse'>

            {/** topcard section */}
            <div className='flex flex-row justify-around items-center flex-4'>

              {/** p1 pic */}
              <div className='flex flex-col gap-2 items-center text-fore1'>
                <div className='h-30 md:h-40 md:w-40 w-30 rounded-full my-auto bg-back2' />

                {/** p1 time */}
                <div className='bg-back2 rounded-full h-8 w-16' />
              </div>

              <h1 className='text-6xl text-back2 font-bold'>VS</h1>

              {/** p2 pic */}
              <div className='flex flex-col gap-2 items-center text-fore1'>
                <div className='flex flex-col gap-2 items-center text-fore1'>
                <div className='h-30 md:h-40 md:w-40 w-30 rounded-full my-auto bg-back2' />

                {/** p2 time */}
                <div className='bg-back2 rounded-full h-8 w-16' />
              </div>
              </div>
            </div>

            {/** bottom card section */}
            <div className="flex-1 flex flex-row items-center justify-around bg-back2 text-md md:text-lg font-semibold text-fore1">
              {/** p1 name */}
              <div className='bg-back3 rounded-full h-8 w-16'/>
              {/** game mode */}
              <div className='bg-back3 rounded-full h-8 w-10'/>
              {/** p2 name */}
              <div className='bg-back3 rounded-full h-8 w-16'/>
            </div>

          </div>
        ))
      }
    </>
  )
}

export const ChangePasswordSkeleton = ({ close }: {close: () => void}) => {
  return (
    <div className='absolute z-100 rounded-[inherit] w-full h-full flex justify-center items-center backdrop-blur-xs bg-black/10 p-5'>

      {/** actual card */}
      <div className='w-full max-w-100 border border-brown2 bg-back4 rounded-lg flex flex-col'>

        {/** top section */}
        <div className='flex flex-row p-3 justify-between items-center'>

          {/** title */}
          <h1 className='text-brown1'>Change your password</h1>

          {/** close */}
          <Button bgspan='fore/20' click={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
            <IoClose className='text-fore2 text-xl' />
          </Button>
        </div>

        {/** content */}
        <div className='flex flex-col py-2 px-10 gap-5 items-center w-full animate-pulse'>

          {/** current pass */}
          <div className='w-full h-10 bg-back2 flex flex-col' />

          {/** new pass */}
          <div className='w-full h-10 bg-back2 flex flex-col' />
          
          {/** confirm new pass */}
          <div className='w-full h-10 bg-back2 flex flex-col' />

          {/** submit button */}
          <div className='w-full flex flex-row justify-end'>
            <div className='w-18 h-10 rounded-md bg-back2' />
          </div>
        </div>
      </div>
    </div>
  )
}

export const InvitationSkeleton = () => {
  return (
    <>
      {
        Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='w-95/100 max-w-200 h-16 bg-back2 rounded-lg gap-2 hover:bg-back hover:scale-102 duration-75 transition-all ease-in-out items-center flex justify-between px-3 cursor-pointer animate-pulse'>

            {/** to name */}
            <div className='w-30 h-8 rounded-lg bg-back'/>

            {/** mode and expirtation */}
            <div className="flex-col center gap-1">

              {/** mode */}
              <div className='w-20 h-4 rounded-full bg-back'/>

              {/** expiraton */}
              <div className='w-20 h-4 rounded-full bg-back'/>

            </div>

            {/** cancel */}
            <div className='w-18 h-8 rounded-lg bg-back'/>

          </div>
        ))
      }
    </>
  )
}