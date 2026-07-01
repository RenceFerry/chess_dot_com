'use client';

import { useState, useEffect, useRef } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import WithStream from '@/_components/[user]/pages/withStream';
import WithoutStream from '@/_components/[user]/pages/play/withoutStream';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaTableList } from "react-icons/fa6";
import { clsx } from 'clsx';
import ChatWindow from '@/_components/[user]/pages/chatWindow';
import MovesList from '@/_components/[user]/pages/movesList';
import SettingsWindow from '@/_components/[user]/pages/play/settingsWindow';
import { BiSlider } from "react-icons/bi";
import { PlaySettingsType } from '@/_lib/types';
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
  const isStream = searchParams.get('stream') === '1';
  const chat = searchParams.get('chat') === '1';
  const privateChat = searchParams.get('private') === '1';
  const settingsRef = useRef<PlaySettingsType>({ stream: isStream, chat, privateChat });
  const [ settingsState, setSettingsState ] = useState<PlaySettingsType>({
    chat,
    stream: isStream,
    privateChat
  });

  console.log(chat, settingsState.chat);

  // handle back clicking
  function handleBack() 
  {
    const param = new URLSearchParams();
    param.set('tab', 'play');
    router.replace(`/${pathname.split('/')[1]}?${param.toString()}`);
  }

  //handle close chat, settings, moves list window
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

  // settings state init 
  useEffect(() => {
    settingsRef.current = { ...settingsState };
  }, [settingsState]);

  return (
    <div className='w-full h-full min-h-0 min-w-0 flex flex-col bg-back4 rounded-t-3xl relative overflow-hidden'>

      {/** top section */} 
      <div className='flex flex-row p-3 md:p-5 justify-between items-center w-full text-brown1'>
        {/** back */}
        <Button bgspan='fore/20' type='button' onClick={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-2xl md:text-3xl' />
        </Button>

        {/** title */}
        <h1 className='text-xl font-bold'>Online Game</h1>
        
        {/** settings */}
        <Button bgspan='fore/20' type='button' onClick={() => toggleHidden('settings')} title='settings' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <BiSlider className='text-2xl md:text-3xl' />
        </Button>
      </div>

      {/** main section */}
      <main className='flex flex-1 flex-col items-center w-full min-h-0 min-w-0'>

        { isStream ?
          <WithStream /> :
          <WithoutStream />
        }

        {/** chat input and controls */}
        <div className={clsx('flex flex-row bg-back1 rounded-t-2xl items-center justify-center gap-2 p-2 md:p-5 mt-3 z-10')}>

          {/** toggle chat window */}
          <Button bgspan='fore/20' onClick={() => toggleHidden('chats')} title='toggle chat window' type='button' className='rounded-full w-12 h-12 hover:bg-back cursor-pointer'>
            <IoChatbubbleEllipsesSharp className='text-brown1 text-3xl m-auto' />
          </Button>

          {/** toggle moves list */}
          <Button bgspan='fore/20' onClick={() => toggleHidden('moves')} title='toggle moves list' type='button' className='rounded-full w-12 h-12 hover:bg-back cursor-pointer'>
            <FaTableList className='text-brown1 text-2xl m-auto' />
          </Button>

          {/** chat input */
            settingsState.chat &&
            <form action="none" className='w-64 md:w-96 lg:w-120'>
              <input type="text" name='chat' title='chat' placeholder='Chat with your opponent' className='rounded-full outline-none text-fore bg-back3 p-3 w-full md:text-lg border border-transparent hover:border-brown1 focus:border-brown1' />
            </form>
          }
        </div>

        {/** chat window */
          (!chatWindowHidden) &&
          <ChatWindow close={toggleHidden} />
        }


        {/** moves list window */
          !movesListHidden &&
          <MovesList close={toggleHidden} />
        }

        {/** settings window */
          !settingsWindowHidden &&
          <SettingsWindow setSettingsState={setSettingsState} settingsState={settingsState} close={toggleHidden} />
        }
        
      </main>
    </div>
  )
}

export default Page;