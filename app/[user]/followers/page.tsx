'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/_components/wrappers/button';
import { IoArrowBackSharp } from 'react-icons/io5';
import Search from '@/_components/[user]/search';
import Followers from '@/_components/[user]/pages/followers/followers';

import { players } from '@/_lib/test';
import ProfileCard from '@/_components/[user]/profileCard';
import clsx from 'clsx';

const Page = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [ showFollowers, setShowFollowers ] = useState<boolean>(true);
  const [ profileId, setProfileId ] = useState<string>('');

  //view card
  function viewProfile(id: string) {
    setProfileId(id);
  }

  // handle back clicking
  function handleBack() 
  {
    const param = new URLSearchParams();
    param.set('tab', 'more');
    router.replace(`/${pathname.split('/')[1]}?${param.toString()}`);
  }
  return (
    <div className='w-full h-full min-h-0 min-w-0 flex flex-col bg-back4 rounded-t-3xl relative'>
      
      {/** top section */} 
      <div className='flex flex-row py-2 px-3 md:px-5 justify-between items-center w-full text-brown1'>
        {/** back */}
        <Button bgspan='fore/20' type='button' onClick={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-2xl md:text-3xl' />
        </Button>

        {/** followers or followed */}
        <div className='flex flex-row font-bold'>

          {/** followers button switch to followers */}
          <Button bgspan='fore/20' onClick={() => setShowFollowers(true)} className={clsx('py-2 px-4', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': showFollowers,
            'text-fore1': !showFollowers,
          })}>
            <h1>Followers</h1>
          </Button>

          {/** followed button switch to players followed */}
          <Button bgspan='fore/20' onClick={() => setShowFollowers(false)} className={clsx('px-4 py-2', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': !showFollowers,
            'text-fore1': showFollowers,
          })}>
            <h1>Following</h1>
          </Button>
        </div>

        <div className='h-10 w-10' />
      </div>

      {/** main section */}
      <main className='flex-1 w-full flex-col relative min-h-0 min-w-0 overflow-auto no-scrollbar'>

        {/** search bar */}
        <Search what='followers' />

        {/** followers */}
        <Followers viewProfile={viewProfile} followers={players} />
      </main>

      {// profile card
        profileId && 
        <ProfileCard close={() => setProfileId('')} />
      }
    </div>
  )
}

export default Page;