'use client';

import useUserDet from "@/_lib/context/userDetailsContext";
import Button from "./wrappers/button";
import { getFirstName } from "@/_utils/helpers";
import Image from "next/image";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getPlayerInfo } from "@/_utils/serverActions/fetchActions";
import { useCallback, useState } from "react";
import useSocket from "@/_lib/hooks/useSocket";
import { useNotif } from "@/_lib/context/notifContext";
import { ShowInvitationCardContextType } from "@/_lib/types";
import { FaChessPawn } from "react-icons/fa";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

const InvitationCard = ({ showInvitationCard }: { showInvitationCard: ShowInvitationCardContextType }) => {
  const userInfo = useUserDet();
  const socket = useSocket();
  const notif = useNotif();
  const [ waiting, setWaiting ] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ['getPlayer', showInvitationCard?.showInvitationCard?.fromId],
    queryFn: async () => {
      const { data, error } = await getPlayerInfo(showInvitationCard?.showInvitationCard?.fromId || '')

      if (error || !data) throw new Error(error || '');

      return data;
    },
    staleTime: 1000 * 60 * 60 * 24
  })

  // close
  const close = useCallback(() => showInvitationCard?.setShowInvitationCard(null), [showInvitationCard])

  // reject
  const handleReject = useCallback(() => {
    // update invites list
    queryClient.invalidateQueries({ queryKey: ['get_invitations'], refetchType: 'all' });

    socket.emit('invitation:reject', {
      fromId: showInvitationCard?.showInvitationCard?.fromId,
      fromName: showInvitationCard?.showInvitationCard?.fromName,
      toId: userInfo.id,
      toName: userInfo.name,
      data: { ...showInvitationCard?.showInvitationCard?.data }
    })

    close();
  }, [socket, userInfo, showInvitationCard, close, queryClient]);
  
  // accept
  const handleAccept = useCallback(() => {
    // check if invitation already expired
    const ex = showInvitationCard?.showInvitationCard?.data.ex;

    if (!ex || ex < Date.now()) {
      notif?.setNotif({
        message: 'Invitation had expired',
        color: 'error2'
      })

      return close();
    }

    let color: 'White' | 'Black';
    // assign color if random (pieceColor will be the color of the opponent)
    if (showInvitationCard.showInvitationCard?.data.pieceColor === 'Random') {
      const random = Math.random();
      color = random < 0.5 ? 'White' : 'Black';
      console.log(color, random, random < 0.5);
      showInvitationCard.setShowInvitationCard((prev) => {
        if (!prev || !showInvitationCard.showInvitationCard) return null;
        return { ...prev, data: {...prev?.data, pieceColor: color}}
      })
    } else { color = showInvitationCard.showInvitationCard?.data.pieceColor || 'White'}

    // waiting window
    setWaiting(true);

    // emit invitation accept
    socket.emit('invitation:accept', {
      fromId: showInvitationCard?.showInvitationCard?.fromId,
      fromName: showInvitationCard?.showInvitationCard?.fromName,
      toId: userInfo.id,
      toName: userInfo.name,
      data: { ...showInvitationCard?.showInvitationCard?.data, pieceColor: color }
    });
  }, [socket, showInvitationCard, userInfo, notif, close]);

  // handle cancel
  const handleCancel = useCallback(() => {
    // 
    socket.emit('invitation:cancel', {
      toId: userInfo.id,
      toName: userInfo.name,
      fromId: showInvitationCard?.showInvitationCard?.fromId,
      fromName: showInvitationCard?.showInvitationCard?.fromName,
      data: { ...showInvitationCard?.showInvitationCard?.data },
    })

    close();
  }, [close, userInfo, showInvitationCard, socket]);
 
  return (
    <> 
    { 
      !waiting ?
        <div className="h-full w-full absolute center top-0 left-0 z-1001 bg-black/60 backdrop-blur-xs">

          {/** the actual card */}
          <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-80 w-[90%] md:w-65/100 max-w-150 overflow-clip'>

            {/** top layer with close button */}
            <div className="w-full flex flex-row justify-end p-2">
              <Button bgspan='fore/20' click={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
                <IoClose className='text-fore2 text-xl' />
              </Button>
            </div>

            {
              isError ?
                <h1 className="text-center text-fore2 py-5">Error retrieving game and players data</h1>
              :
                <div className='flex w-full flex-col min-w-0 items-center'>

                  {/** vs */}
                  <div className='flex flex-row w-full justify-center items-center py-2 px-5 gap-4 bg-back3'>

                    {/** player avatar & name */}
                    <div className='flex flex-col gap-3 items-center w-1/2 max-w-40'>

                      {/** avatar */}
                      <Image unoptimized={true} src={userInfo.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} loading="eager" width={72} height={72} alt='avatar' className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

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
                          <Image unoptimized={false} src={data?.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} width={120} height={120} alt='avatar' loading="eager" className='w-full aspect-square rounded-full object-cover bg-brown2/40 p-1' />

                          {/** name */}
                          <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{getFirstName(data?.name || '')} {data?.elo}</h1>
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

                  {/** options */}
                  <div className='flex flex-col w-full gap-3 items-center p-5 min-w-0'>
                    
                    {/** piece color */}
                    <div className='flex flex-col w-full items-center'>
                      <div className='text-fore2'>
                        Your Piece color
                      </div>
                      <div className='w-1/2 min-w-64 max-w-75 bg-back rounded-lg text-fore1 p-3 center' title='piece color'>
                        {showInvitationCard?.showInvitationCard?.data.pieceColor === 'Black' ? 'White' : showInvitationCard?.showInvitationCard?.data.pieceColor}
                      </div>
                    </div>

                    {/** mode */}
                    <div className='flex flex-col w-full items-center'>
                      <div className='text-fore2'>
                        Game mode
                      </div>
                      <div id='mode' className='w-1/2 min-w-64 max-w-75 bg-back rounded-lg text-fore1 p-3 center'>
                        {showInvitationCard?.showInvitationCard?.data.mode}
                      </div>
                    </div>

                    {/** message and buttons */}
                    <div className='flex-col gap-2 flex flex-wrap items-center justify-center w-full'>

                      {/** message */}
                      <h1 title='message' className='h-10 w-1/2 min-w-64 max-w-75 bg-back2 p-2 rounded-lg'>
                        {showInvitationCard?.showInvitationCard?.data.message}
                      </h1>

                      {/** buttons */}
                      <div className='h-10 w-3/4 min-w-20 px-3 text-back4 font-semibold flex flex-row gap-5 items-center justify-center' >

                        {/** reject */}
                        <Button className="h-full w-1/3 bg-error1 text-back4 hover:bg-error2 center rounded-lg" click={handleReject}>
                          Reject
                        </Button>

                        {/** accept */}
                        <Button className="h-full w-1/3 bg-green2 text-back4 hover:bg-green3 center rounded-lg" click={handleAccept}>
                          Accept
                        </Button>

                      </div>
                    </div>
                  </div>

                  {/** note */}
                  <p className='px-10 py-3 text-fore2 text-xs md:text-sm text-center'>Invitations only exist for 5 minutes, if you accept an already expired invitation, it will be cancelled.</p>
                </div>
            }
          </div>
        
        </div>
      : // waiting
        <div className="h-full w-full absolute center top-0 left-0 z-1001 bg-black/60 backdrop-blur-xs">

          {/** the actual card */}
          <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-80 w-[90%] md:w-65/100 max-w-150'>

            {/** waiting */}
            <div className='w-full flex flex-col p-3 center text-lg font-bold text-brown1 md:text-xl'>
              Waiting for confirmation
              <div className="flex flex-row gap-2 w-full center pt-3">
                {
                  Array.from({ length: 7}).map((_, i) => (
                    <div className={`h-2 w-2 rounded-full animate-waiting`} key={i} />
                  ))
                }
              </div>
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
                      <h1 className='text-fore1 text-md text-center md:text-xl font-semibold'>{getFirstName(data?.name || '')} {data?.elo}</h1>
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
                      'text-brown3': showInvitationCard?.showInvitationCard?.data.pieceColor === 'White',
                      'text-brown1': showInvitationCard?.showInvitationCard?.data.pieceColor === 'Black'
                    })} />
                  </div>

                  {/** mode */}
                  <div className='flex flex-col w-1/3 items-center'>
                    <div id='mode' className='w-full max-w-75 bg-brown2 rounded-lg text-back2 p-3 center font-bold text-lg'>
                      {showInvitationCard?.showInvitationCard?.data.mode}
                    </div>
                  </div>

                  {/** piece color */}
                  <div className='flex flex-col items-center rounded-lg aspect-square p-2 bg-back1'>
                    <FaChessPawn size={50} className={clsx('h-10 md:h-14', {
                      'text-brown3': showInvitationCard?.showInvitationCard?.data.pieceColor === 'Black',
                      'text-brown1': showInvitationCard?.showInvitationCard?.data.pieceColor === 'White'
                    })} />
                  </div>
                </div>

                {/** button */}
                <div className='h-10 w-1/2 min-w-20 px-3 text-back4 font-semibold flex flex-row gap-5 items-center justify-center' >

                  {/** cancel */}
                  <Button className="h-full w-full bg-error1 text-back4 hover:bg-error2 center rounded-lg" click={handleCancel}>
                    Cancel
                  </Button>

                </div>

              </div>

              {/** note */}
              <p className='px-10 py-3 text-fore2 text-xs md:text-sm text-center'>Waiting for {getFirstName(showInvitationCard?.showInvitationCard?.fromName || '')} to confirm. Stay on this Page</p>
            </div>
          </div>
        
        </div>
    }
    </>
  )
}

export default InvitationCard