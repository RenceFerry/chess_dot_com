'use client';

import React, { SetStateAction } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import Toggler from '@/_components/toggler';
import clsx from 'clsx';
import { PlaySettingsType } from '@/_lib/types';
import Button from '@/_components/wrappers/button';

const SettingsWindow = ({ close, settingsState, setSettingsState }: { close: (win: 'settings' | 'chats' | 'moves' ) => void; settingsState: PlaySettingsType ; setSettingsState: React.Dispatch<SetStateAction<PlaySettingsType>> }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function chatActivate(active: boolean) 
  {
    setSettingsState((prev) => {
      if (prev) return { ...prev, chat: active};
      return prev;
    })

    // set param chat to 1 if active is true, else set it to 0
    const param = new URLSearchParams(searchParams.toString());
    param.set('chat', active ? '1' : '0');
    router.replace(`${pathname}?${param.toString()}`);
  }

  function streamActivate(active: boolean) 
  {
    setSettingsState((prev) => {
      if (prev) return { ...prev, stream: active};
      return prev;
    })

    // set param stream to 1 if active is true, else set it to 0
    const param = new URLSearchParams(searchParams.toString());
    param.set('stream', active ? '1' : '0');
    router.replace(`${pathname}?${param.toString()}`);
  }

  function privateChatActivate(active: boolean) 
  {
    setSettingsState((prev) => {
      if (prev) return { ...prev, privateChat: active};
      return prev;
    })

    // set param private to 1 if active is true, else set it to 0
    const param = new URLSearchParams(searchParams.toString());
    param.set('private', active ? '1' : '0');
    router.replace(`${pathname}?${param.toString()}`);
  }

  return (
    <div className='absolute w-full h-full top-0 left-0 z-100 grid items-center backdrop-blur-sm bg-black/40'>

      {/** actual window */}
      <div className='flex flex-col m-auto rounded-lg max-w-100 w-1/2 bg-back3 border border-brown2'>

        {/** title & close button */}
        <div className='w-full flex flex-row p-3 justify-between'>

          {/** title */}
          <h1 className='text-lg text-brown1'>Settings</h1>

          {/** close button */}
          <Button bgspan='fore/20' click={() => close('settings')} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
            <IoClose className='text-fore2 text-xl' />
          </Button>
        </div>

        {/** content */}
        <div className='flex flex-col gap-5 py-3 px-5'>

          {/** chat enabler */}
          <div className='flex flex-row justify-between items-center'>
            <h1>Enable Chat</h1>
            <Toggler name='chatDisable' active={settingsState?.chat || false} onClick={() => chatActivate(!settingsState.chat)} />
          </div>

          {/** stream enabler */}
          <div className='flex flex-row justify-between items-center'>
            <h1>Enable Stream</h1>
            <Toggler name='streamGame' active={settingsState?.stream || false} onClick={() => streamActivate(!settingsState.stream)} />
          </div>

          {/** private chat enabler */}
          <div title='Chat with your opponent privately when streaming' className={clsx('flex flex-row justify-between items-center', {
            'pointer-events-none opacity-50': !settingsState?.stream
          })}>
            <h1>Private Chat</h1>
            <Toggler name='chatPrivate' active={settingsState?.privateChat || false} onClick={() => privateChatActivate(!settingsState.privateChat)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsWindow;