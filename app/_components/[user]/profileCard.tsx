'use client';

import { useState } from 'react';
import Button from '../wrappers/button';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { getPlayerStat } from '@/_utils/serverActions/fetchActions';
import { formatFollowers } from '@/_utils/helpers';
import { ProfileCardSkeleton } from '../skeletons';
import useUserDet from '@/_lib/context/userDetailsContext';

const ProfileCard = ({ close, id }: { close: () => void, id: string } ) => {
  const [ showInviteCard, setShowInviteCard ] = useState<boolean>(false);
  const [ inputValue, setInputValue ] = useState<string>('');
  const userInfo = useUserDet();

  // fetch player's information
  const { data: player, isError, isPending } = useQuery({
    queryKey: ['getPlayerInfo',  id],
    queryFn: async () => {
      const { data, error } = await getPlayerStat(id);
      console.log('Received fetched data: ', data, error);
      if (error || !data) throw new Error(error || '');

      return data;
    },
    staleTime: 1000 * 30,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;

    if (input.value.length > 30) return;
    setInputValue(input.value);
  }

  // loading page
  if (isPending) return <ProfileCardSkeleton close={close} />

  return (
    <div className='absolute z-100 top-0 left-0 justify-center items-center w-full h-full flex backdrop-blur-xs bg-black/40 rounded-[inherit] min-w-0'>

      {/** the actual card */
        <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-64 w-[65%] max-w-150'>

          {/** title & close button */}
          <div className='w-full flex flex-row p-3 justify-end'>
            {/** close button */}
            <Button bgspan='fore/20' onClick={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
              <IoClose className='text-fore2 text-xl' />
            </Button>
          </div>

          {/** content */
            !isError ?
            !showInviteCard ?

            // profile info
            <div className='flex flex-col p-3 pb-10 justify-start items-center w-full gap-2'>

              {/** profile details container */}
              <div className='w-full p-2 flex flex-row gap-2 justify-center min-h-0 min-w-0 flex-1 items-center'>

                {/** avatar container */}
                <div className='w-1/2 aspect-square flex justify-end flex-1 min-h-0 min-w-0 items-center'>
                  <Button bgspan='fore/20' className='h-full aspect-square rounded-full bg-brown2/40 p-1 cursor-pointer max-h-48'>

                    {/** avatar */}
                    <Image fill unoptimized={true} src={player?.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} loading='eager' alt='avatar' className='h-full w-full rounded-full object-cover' />

                    {/** status dot */}
                    <div className={clsx('h-4 w-4 bg-green2 rounded-full absolute top-1/12 left-1/12')} />
                  </Button>
                </div>

                {/** details */}
                <div className='flex flex-col flex-1 px-2 justify-center items-start'>
                  <h1 className='font-semibold text-fore1 text-md md:text-2xl'>{player?.name}</h1>
                  <h1 className='text-fore2 text-sm md:text-xl'>{formatFollowers(player?._count.followers || 0)} follower{player._count.followers > 1 && 's'}</h1>
                  <h1 className='text-fore2 text-sm md:text-xl mt-2 '>
                    <span className='text-green2'>W:&nbsp;</span>{player?.win}&nbsp;&nbsp;
                    <span className='text-error2'>L:&nbsp;</span>{player?.lose}&nbsp;&nbsp;
                    <span className='text-brown2'>D:&nbsp;</span>{player?.draw}&nbsp;&nbsp;
                  </h1>

                  {/** follow */}
                  <Button className='grid items-center rounded-lg bg-brown2 mt-3 py-1 px-5 font-semibold text-back4 hover:bg-brown3'>
                    {
                      player?.followed ? 'Unfollow' : 'Follow'
                    }
                  </Button>
                </div>
              </div>

              {/** status */}
              <div className='flex flex-row justify-center items-center w-full text-md md:text-lg gap-2'>

                {/** playing */}
                <div className={clsx('flex-1 flex justify-end', {
                  'text-green3': player.playing,
                  'text-error2': !player.playing
                })}>{player.playing ? 'Playing' : 'Not playing' }</div>
                <div className='h-8 w-0.5 bg-fore2/40' />
                <div className={clsx('flex-1', {
                  'text-green3': player.streaming,
                  'text-error2': !player.streaming
                })}>{player.streaming ? 'Streaming' : 'Not streaming' }</div>
              </div>

              {/** options */}
              <div className='flex flex-col items-center gap-2 w-full mt-3'>
                
                {/** invite button */}
                <Button title="You can still invite players even though they're playing, they can accept it and play in other tab" onClick={() => setShowInviteCard(true)} bgspan='fore/40' className='bg-green2 text-back3 font-semibold p-2 w-[70%] min-w-64 max-w-80 rounded-xl hover:bg-green3 truncate'>
                  Invite {player.name.split(' ')[0]}
                </Button>

                {/** watch stream button */
                  player?.streaming &&
                  <Button bgspan='fore/40' className='bg-brown1 text-back3 font-semibold p-2 w-[70%] min-w-64 max-w-80 rounded-xl hover:bg-brown2'>
                    Watch game
                  </Button>
                }
                
              </div>

            </div> :

            // invite card
            <div className='flex w-full flex-col gap-4 min-w-0'>

              {/** vs */}
              <div className='flex flex-row w-full justify-center items-center py-2 px-5 gap-4 bg-back3'>

                {/** player avatar & name */}
                <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

                  {/** avatar */}
                  <Image unoptimized src={userInfo.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={20} height={20} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

                  {/** name */}
                  <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{userInfo.name} ({userInfo.elo})</h1>
                </div>

                {/** vs */}
                <h1 className='text-error2 text-5xl font-semibold'>VS</h1>

                {/** opponent avatar & name */}
                <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

                  {/** avatar */}
                  <Image unoptimized src={player.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={20} height={20} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

                  {/** name */}
                  <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{player.name} ({player.elo})</h1>
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

                {/** message and submit button */}
                <div className='flex-col gap-2 flex flex-wrap items-center justify-center w-full'>

                  {/** message input */}
                  <input onChange={handleChange} value={inputValue} title='message' type='text' placeholder='send a message' className='h-10 w-1/2 min-w-64 max-w-75 bg-back2 p-2 rounded-lg' />

                  {/** char count */}
                  <h2 className='text-fore2'>{inputValue.length}/30</h2>

                  {/** invite */}
                  <Button bgspan='back4/20' className='h-10 w-64 rounded-lg min-w-20 py-2 px-3 bg-green2 text-back4 font-semibold'>
                    Invite
                  </Button>
                </div>
              </form>
            </div>:
            <div className='flex flex-row justify-center items-center py-10 text-fore2 text-lg font-semibold'>
              {"Fetching player's information failed"}
            </div>
          }
        </div>
      }
      
    </div>
  )
}

export default ProfileCard;