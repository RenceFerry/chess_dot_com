'use client';

import { useState, useEffect } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import WithStream from '@/_components/[user]/pages/withStream';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaTableList } from "react-icons/fa6";
import { clsx } from 'clsx';
import ChatWindow from '@/_components/[user]/pages/chatWindow';
import MovesList from '@/_components/[user]/pages/movesList';
import Button from '@/_components/wrappers/button';

const Page = () => 
{
  const [ chatWindowHidden, setChatWindowHidden ] = useState<boolean>(true);
  const [ movesListHidden, setMovesListHidden ] = useState<boolean>(true);
  const [ settingsWindowHidden, setSettingsWindowHidden ] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const opponent = searchParams.get('id');

  // handle back clicking
  function handleBack() 
  {
    const param = new URLSearchParams();
    param.set('tab', 'streams');
    router.replace(`/${pathname.split('/')[1]}?${param.toString()}`);
  }

  // handle close chat, settings, moves list window
  function toggleHidden(win: 'chats' | 'moves' | 'settings')
  {
    if (win === 'chats') setChatWindowHidden(!chatWindowHidden);
    else if (win === 'settings') setSettingsWindowHidden(!settingsWindowHidden);
    else setMovesListHidden(!movesListHidden);
  }

  // handle invalid id in param
  useEffect(() => 
  {
    if (!opponent) 
    {
      const param = new URLSearchParams();
      param.set('tab', 'play');
      router.replace(`/${pathname.split('/')[1]}?${param.toString()}`);
    }


  }, [opponent, router, pathname]);

  return (
    <div className='w-full h-full min-h-0 min-w-0 flex flex-col bg-back4 rounded-t-3xl relative overflow-hidden'>

      {/** top section */} 
      <div className='flex flex-row px-5 py-5 justify-between items-center w-full text-brown1'>
        {/** back */}
        <Button bgspan='fore/20' type='button' onClick={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-3xl' />
        </Button>

        {/** title */}
        <h1 className='text-xl font-bold'>Stream</h1>

        <div />
      </div>

      {/** main section */}
      <main className='flex flex-1 flex-col items-center w-full min-h-0 min-w-0'>

        <WithStream stream={true} />

        {/** chat input and controls */}
        <div className={clsx('flex flex-row h-20 bg-back1 rounded-t-2xl items-center justify-center gap-2 px-5 mt-5 z-10')}>

          {/** toggle chat window */}
          <Button bgspan='fore/20' onClick={() => toggleHidden('chats')} title='toggle chat window' type='button' className='rounded-full w-12 h-12 hover:bg-back cursor-pointer'>
            <IoChatbubbleEllipsesSharp className='text-brown1 text-3xl m-auto' />
          </Button>

          {/** toggle moves list */}
          <Button bgspan='fore/20' onClick={() => toggleHidden('moves')} title='toggle moves list' type='button' className='rounded-full w-12 h-12 hover:bg-back cursor-pointer'>
            <FaTableList className='text-brown1 text-2xl m-auto' />
          </Button>
        </div>

        {/** chat window */
          (!chatWindowHidden) &&
          <ChatWindow close={toggleHidden} />
        }


        {/** moves list window */
          !movesListHidden &&
          <MovesList close={toggleHidden} />
        }
        
      </main>
    </div>
  )
}

export default Page;