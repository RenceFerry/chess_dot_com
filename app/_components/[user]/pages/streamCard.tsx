'use client';

import clsx from 'clsx';

const StreamCard = ({ plDetails }: { plDetails: { name: string, elo: number, white: boolean }}) => {

  return (
    <div className='bg-back2 flex flex-col rounded-lg min-h-0 h-56 aspect-square md:h-64 lg:h-80 justify-between overflow-clip'>
      <div></div>

      {/** pl details */}
      <div className={clsx('w-full py-2 flex flex-row justify-center items-center px-3 bg-brown1', {
        'bg-brown1 text-back2': plDetails.white,
        'bg-brown5 text-fore1': !plDetails.white
      })}>
        <h1 className='w-30 truncate text-lg'>{plDetails.name}</h1>
        <h1 className='truncate text-lg'>({plDetails.elo})</h1>
      </div>
    </div>
  )
}

export default StreamCard;