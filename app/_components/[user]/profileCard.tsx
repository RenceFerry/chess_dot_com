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
import InviteCard from './inviteCard';

const ProfileCard = ({ close, id }: { close: () => void, id: string } ) => {
  const [ showInviteCard, setShowInviteCard ] = useState<boolean>(false);

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

  

  // loading page
  if (isPending) return <ProfileCardSkeleton close={close} />

  return (
    <div className='absolute z-100 top-0 left-0 justify-center items-center w-full h-full flex backdrop-blur-xs bg-black/40 rounded-[inherit] min-w-0'>

      {/** the actual card */
        <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-80 w-[90%] md:w-65/100 max-w-150'>

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
                    <Image fill unoptimized={false} src={player?.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} loading='eager' alt='avatar' className='h-full w-full rounded-full object-cover' />

                    {/** status dot */}
                    <div className={clsx('h-[10%] aspect-square rounded-full absolute top-2/20 left-2/20 border-back1 border', {
                      'bg-green2': player.online,
                      'bg-error2': !player.online
                    })} />
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

              {/** note */}
              <p className='px-10 py-3 text-fore2 text-xs md:text-sm text-center'>You could still invite players, even though they&apos;re offline, they will be notified once they become online.</p>
            </div> 
            :

            // invite card
            <InviteCard player={player} /> 
            :
            /// error
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