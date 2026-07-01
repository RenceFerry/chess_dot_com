import React from 'react'
import Image from 'next/image';
import Button from '@/_components/wrappers/button';

const VsRobotCard = () => {
  return (
    <div className='flex w-full flex-col gap-4 min-w-0'>

      {/** vs */}
      <div className='flex flex-row w-full justify-center items-center py-2 px-5 gap-4 bg-back3'>

        {/** player avatar & name */}
        <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

          {/** avatar */}
          <Image unoptimized src={'https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male'} width={20} height={20} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

          {/** name */}
          <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>John Doe (1234)</h1>
        </div>

        {/** vs */}
        <h1 className='text-error2 text-5xl font-semibold'>VS</h1>

        {/** opponent avatar & name */}
        <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

          {/** avatar */}
          <Image unoptimized src={'https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male'} width={20} height={20} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

          {/** name */}
          <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>John Doe (1234)</h1>
        </div>
      </div>

      {/** options */}
      <form className='flex flex-col w-full gap-3 items-center p-5 min-w-0'>
        
        {/** piece color */}
        <div className='flex flex-col w-full items-center'>
          <label className='text-fore2' htmlFor='pieceColor'>
            Select your piece color
          </label>
          <select id='pieceColor' className='w-1/2 min-w-64 max-w-75 bg-back rounded-lg text-fore1 p-3' name='pieceColor' title='piece color' defaultValue="white">
            <option value="" disabled>Select your piece color</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="random">Random</option>
          </select>
        </div>

        {/** mode */}
        <div className='flex flex-col w-full items-center'>
          <label className='text-fore2' htmlFor='pieceColor'>
            Select game mode
          </label>
          <select id='pieceColor' className='w-1/2 min-w-64 max-w-75 bg-back rounded-lg text-fore1 p-3' name='pieceColor' title='piece color' defaultValue="classic">
            <option value="" disabled>Mode</option>
            <option value="classic">Classic</option>
            <option value="rapid">Rapid</option>
            <option value="blitz">Blitz</option>
            <option value="bullet">Bullet</option>
          </select>
        </div>

        {/* submit button */}
        <div className='flex-col gap-2 flex flex-wrap items-center justify-center w-full'>

          {/** invite */}
          <Button bgspan='back4/20' className='h-10 w-64 rounded-lg min-w-20 py-2 px-3 bg-green2 text-back4 font-semibold'>
            Invite
          </Button>
        </div>
      </form>
    </div>
  )
}

export default VsRobotCard;