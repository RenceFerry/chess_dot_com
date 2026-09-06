'use client';

import useUserDet from '@/_lib/context/userDetailsContext';
import { ConfirmationContextType } from '@/_lib/types';
import Image from 'next/image';
import { getFirstName } from '@/_utils/helpers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlayerInfo } from '@/_utils/serverActions/fetchActions';
import { FaChessPawn } from 'react-icons/fa';
import clsx from 'clsx';
import Button from './wrappers/button';
import { useCallback } from 'react';
import useSocket from '@/_lib/hooks/useSocket';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';

// sent parameter here is for rendering this component on the sent invitation section found in more tab
const Confirmation = ({ confirmation }: { confirmation: ConfirmationContextType }) => {
  const userInfo = useUserDet();
  const socket = useSocket();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  // get image of opponent
  const { data, isPending } = useQuery({
    queryKey: ['getPlayer', confirmation.confirmation?.toId],
    queryFn: async () => {
      const { data, error } = await getPlayerInfo(confirmation.confirmation?.toId || '')

      if (error || !data) throw new Error(error || '');

      return data;
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  // close
  const close = useCallback(() => confirmation.setConfirmation(null), [confirmation])

  // handle confirm
  const handleConfirm = useCallback(() => {
    // send confirmation
    socket.emit('invitation:confirm', {
      fromId: userInfo.id,
      toId: confirmation.confirmation?.toId,
      toName: confirmation.confirmation?.toName,
      fromName: userInfo.name,
      data: { ...confirmation.confirmation?.data }
    });

    // redirect to play page
    const params = new URLSearchParams();
    params.set('id', confirmation.confirmation?.toId || '');
    params.set('chat', userInfo.settings?.chatDisable ? '0' : '1');
    params.set('private', userInfo.settings?.chatPrivate ? '1' : '0');
    params.set('stream', userInfo.settings?.streamGame ? '1' : '0');
    params.set(confirmation.confirmation!.toId, confirmation.confirmation?.data.pieceColor === 'Black' ? 'White' : 'Black');
    params.set(confirmation.confirmation!.fromId, confirmation.confirmation?.data.pieceColor === 'Black' ? 'Black' : 'White');
    params.set('mode', confirmation.confirmation!.data.mode);

    // check if player is on /plays page

    close();
    if (pathname.toLowerCase() === `/${userInfo.name.replaceAll(' ', '').toLowerCase()}/play`) {
      return window.open(`/${userInfo.name.replaceAll(' ', '')}/play?${params.toString()}`)
    }

    router.push(`/${userInfo.name.replaceAll(' ', '')}/play?${params.toString()}`);
  }, [pathname, userInfo, confirmation, socket, router, close]);

  // handle cancel
  const handleCancel = useCallback(() => {
    // update invites list
    queryClient.invalidateQueries({ queryKey: ['get_invitations'], refetchType: 'all' });

    socket.emit('invitation:cancel', {
      fromId: userInfo.id,
      toId: confirmation.confirmation?.toId,
      toName: confirmation.confirmation?.toName,
      fromName: userInfo.name,
      data: { ...confirmation.confirmation?.data },
    })

    close();
  }, [close, userInfo, confirmation, socket, queryClient]);

  console.log('confirmation', confirmation.confirmation);

  return (
    <div className="h-full w-full absolute center top-0 left-0 z-1002 bg-black/60 backdrop-blur-xs">

      {/** the actual card */}
      <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-64 w-9/10 md:w-[65%] max-w-150'>

        {/** confirmation */}
        <div className='w-full flex flex-row p-3 justify-between text-lg font-bold text-brown1 md:text-xl'>

          <div />

          {/** title */
            !confirmation.confirmation?.sent ?
            <h1>
              {getFirstName(confirmation.confirmation?.toName || '' )} accepted your invitation
            </h1> :
            <div />
          }

          {/** close button */
            confirmation.confirmation?.sent ?
              <Button bgspan='fore/20' click={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
                <IoClose className='text-fore2 text-xl' />
              </Button> 
            :
              <div />
          }

        </div>

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

              {/** avatar */
                !isPending ? 
                <>
                  <Image unoptimized={false} src={data?.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={120} height={120} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

                  {/** name */}
                  <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{getFirstName(data?.name || confirmation.confirmation?.toName || '')} {data?.elo}</h1>
                </>
                : 
                <>
                  <div className="w-full aspect-square rounded-full animate-pulse bg-back3" />
                  {/** name */}
                  <div className='w-26 h-8 rounded-full animate-pulse bg-back3' />
                </>
              }

            </div>
          </div>

          {/** data */}
          <div className='flex flex-col w-full gap-3 items-center p-5 min-w-0'>
            
            <div className="w-full flex flex-row gap-2 center">

              {/** piece color, piece color is the color of the opponent so the the user's color must be opposite */}
              <div className='flex flex-col items-center rounded-lg aspect-square p-2 bg-back1'>
                <FaChessPawn size={50} className={clsx('h-10 md:h-14', {
                  'text-brown3': confirmation.confirmation?.data.pieceColor === 'Black',
                  'text-brown1': confirmation.confirmation?.data.pieceColor === 'White'
                })} />
              </div>

              {/** mode */}
              <div className='flex flex-col w-1/3 items-center'>
                <div id='mode' className='w-full max-w-75 bg-brown2 rounded-lg text-back2 p-3 center font-bold text-lg'>
                  {confirmation.confirmation?.data.mode}
                </div>
              </div>

              {/** piece color */}
              <div className='flex flex-col items-center rounded-lg aspect-square p-2 bg-back1'>
                <FaChessPawn size={50} className={clsx('h-10 md:h-14', {
                  'text-brown3': confirmation.confirmation?.data.pieceColor === 'White',
                  'text-brown1': confirmation.confirmation?.data.pieceColor === 'Black'
                })} />
              </div>
            </div>

            {/** buttons */}
            <div className='h-10 w-3/4 min-w-20 px-3 text-back4 font-semibold flex flex-row gap-5 items-center justify-center' >

              {/** cancel */}
              <Button className="h-full w-1/3 bg-error1 text-back4 hover:bg-error2 center rounded-lg" click={handleCancel}>
                Cancel
              </Button>

              {/** confirm */
                !confirmation.confirmation?.sent && <Button className="h-full w-1/3 bg-green2 text-back4 hover:bg-green3 center rounded-lg" click={handleConfirm}>
                  Confirm
                </Button>
              }

            </div>

          </div>

          {/** note */
            !confirmation.confirmation?.sent && <p className='px-10 py-3 text-fore2 text-xs md:text-sm text-center'>Waiting for {getFirstName(confirmation.confirmation?.fromName || '')} to confirm. Stay on this Page</p>
          }
        </div>
      </div>
    
    </div>
  )
}

export default Confirmation;