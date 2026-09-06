'use client';

import { useCallback, useEffect, useState } from 'react';
import useUserDet from "@/_lib/context/userDetailsContext";
import { PlayerStatType } from "@/_lib/types";
import Image from "next/image";
import Button from "../wrappers/button";
import { getFirstName } from '@/_utils/helpers';
import useSocket from '@/_lib/hooks/useSocket';
import { useNotif } from '@/_lib/context/notifContext';
import clsx from 'clsx';
import { InvitationSendType } from '@/_lib/types';
import { useQueryClient } from '@tanstack/react-query';

const InviteCard = ({ player }: { player: PlayerStatType }) => {
  const userInfo = useUserDet();
  const [ inputValue, setInputValue ] = useState<string>('');
  const [ sendingInvitation, setSendingInvitation ] = useState<boolean>(false);
  const socket = useSocket();
  const notif = useNotif();
  const queryClient = useQueryClient();

  // handle invitation
  const handleInvite = useCallback((formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    setSendingInvitation(true);
    socket.emit('invitation:send', { data: { ...data, ex: Date.now() + (1000 * 60 * 5)}, id: player.id, name: player.name });
  }, [socket, player]);

  useEffect(() => {
    const handleInviteSent = (name: string) => {
      //update list
      queryClient.invalidateQueries({ queryKey: ['get_invitations', 'sent'] });

      setSendingInvitation(false);
      notif?.setNotif({
        message: 'Invitation sent to ' + name,
      })
    }
    
    function handleInvitationPlaying(data: InvitationSendType) {
      setSendingInvitation(false);
      notif?.setNotif({
        message: `You cannot send new invitation to ${getFirstName(data.name)} while playing with them.`
      })
    }

    socket.on('invitation:playing', handleInvitationPlaying);
    
    socket.on('invitation:sent', handleInviteSent);
    return () => {
      socket.off('invitation:playing', handleInvitationPlaying);
      socket.off('invitation:sent', handleInviteSent);
    }
  }, [socket, notif, queryClient])

  // handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;

    if (input.value.length > 30) return;
    setInputValue(input.value);
  }, [])

  return (
    <div className='flex w-full flex-col min-w-0 items-center'>

      {/** vs */}
      <div className='flex flex-row w-full justify-center items-center py-2 px-5 gap-4 bg-back3'>

        {/** player avatar & name */}
        <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

          {/** avatar */}
          <Image unoptimized={true} src={userInfo.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={72} height={72} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

          {/** name */}
          <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{getFirstName(userInfo.name)} ({userInfo.elo})</h1>
        </div>

        {/** vs */}
        <h1 className='text-error2 text-5xl font-semibold'>VS</h1>

        {/** opponent avatar & name */}
        <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

          {/** avatar */}
          <Image unoptimized={false} src={player.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={120} height={120} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

          {/** name */}
          <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{getFirstName(player.name)} ({player.elo})</h1>
        </div>
      </div>

      {/** options */}
      <form action={handleInvite} className='flex flex-col w-full gap-3 items-center p-5 min-w-0'>
        
        {/** piece color */}
        <div className='flex flex-col w-full items-center'>
          <label className='text-fore2' htmlFor='pieceColor'>
            Select your piece color
          </label>
          <select id='pieceColor' className='w-1/2 min-w-64 max-w-75 bg-back rounded-lg text-fore1 p-3' name='pieceColor' title='piece color' defaultValue="White">
            <option value="" disabled>Select your piece color</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Random">Random</option>
          </select>
        </div>

        {/** mode */}
        <div className='flex flex-col w-full items-center'>
          <label className='text-fore2' htmlFor='mode'>
            Select game mode
          </label>
          <select id='mode' className='w-1/2 min-w-64 max-w-75 bg-back rounded-lg text-fore1 p-3' name='mode' title='mode' defaultValue="Classic">
            <option value="" disabled>Mode</option>
            <option value="Classic">Classic</option>
            <option value="Rapid">Rapid</option>
            <option value="Blitz">Blitz</option>
            <option value="Bullet">Bullet</option>
          </select>
        </div>

        {/** message and submit button */}
        <div className='flex-col gap-2 flex flex-wrap items-center justify-center w-full'>

          {/** message input */}
          <input onChange={handleChange} value={inputValue} title='message' type='text' name='message' placeholder='send a message' className='h-10 w-1/2 min-w-64 max-w-75 bg-back2 p-2 rounded-lg' />

          {/** char count */}
          <h2 className='text-fore2'>{inputValue.length}/30</h2>

          {/** invite */}
          <Button disabled={sendingInvitation} bgspan='back4/20' className={clsx('h-10 w-64 rounded-lg min-w-20 py-2 px-3 bg-green2 text-back4 font-semibold flex items-center justify-center', {
            'opacity-70': sendingInvitation
          })}>
            { sendingInvitation ?
              <div className='h-6 aspect-square rounded-full border-back border-t-2 border-r-2 animate-spin' />
              :
              'Invite'
            }
          </Button>
        </div>
      </form>

      {/** note */}
      <p className='px-10 py-3 text-fore2 text-xs md:text-sm text-center'>If a player didn&apos;t accept nor reject your invitation for 5 minutes, your invitation will be automatically cancelled.</p>
    </div>
  )
}

export default InviteCard;