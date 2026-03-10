'use client'

import clsx from 'clsx';

const Navbar = ({ activeTab, change }: { activeTab: string, change: (tab: string) => void }) => {
  return (
    <div className='w-full md:h-16 flex flex-row items-center justify-evenly gap-2 py-2 px-2 font-bold text-xs md:text-sm h-12 text-fore1 lg:h-full lg:w-40 lg:flex-col lg:justify-start lg:pt-5 lg:px-2 lg:border-t-2 lg:border-back3'>

      {/** home tab */}
      <button title='home' type='button' onClick={() => change('home')} className={clsx("flex-1 h-full items-center justify-center rounded-lg flex cursor-pointer lg:h-16 lg:w-full lg:flex-none", {
        'bg-brown3': activeTab === 'home',
        'bg-back2 hover:bg-back1': activeTab !== 'home',
      })}>Home</button>

      {/** Play tab */}
      <button title='play' type='button' onClick={() => change('play')} className={clsx("flex-1 items-center justify-center rounded-lg h-full flex cursor-pointer lg:h-16 lg:w-full lg:flex-none", {
        'bg-brown3': activeTab === 'play',
        'bg-back2 hover:bg-back1': activeTab !== 'play',
      })}>Play</button>

      {/** Streams tab */}
      <button title='streams' type='button' onClick={() => change('streams')} className={clsx("flex-1 items-center justify-center rounded-lg h-full flex cursor-pointer lg:flex-none lg:h-16 lg:w-full", {
        'bg-brown3': activeTab === 'streams',
        'bg-back2 hover:bg-back1': activeTab !== 'streams',
      })}>Streams</button>

      {/** More tab */}
      <button title='more' type='button' onClick={() => change('more')} className={clsx("flex-1 items-center justify-center rounded-lg h-full flex cursor-pointer lg:h-16 lg:flex-none lg:w-full", {
        'bg-brown3': activeTab === 'more',
        'bg-back2 hover:bg-back1': activeTab !== 'more',
      })}>More</button>

    </div>
  )
}

export default Navbar;