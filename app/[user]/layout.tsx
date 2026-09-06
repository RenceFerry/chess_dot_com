'use client';

import React, { useCallback, useEffect } from 'react'
import TopSection from '@/_components/[user]/sections/topSection';
import { UserDetailsProvider } from '@/_lib/context/userDetailsContext';
import useSocket from '@/_lib/hooks/useSocket';
import { useNotif } from '@/_lib/context/notifContext';
import { InvitationAcceptDataType } from '@/_lib/types';
import { getFirstName } from '@/_utils/helpers';
import Button from '@/_components/wrappers/button';
import useShowInvitationCard from '@/_lib/context/showInvitationCardContext';
import InvitationCard from '@/_components/invitationCard';
import { useRouter } from 'next/navigation';
import useConfirmation from '@/_lib/context/confirmationContext';
import Confirmation from '@/_components/confirmation';
import { GameDetailsContextProvider } from '@/_lib/context/gameDetailsContext';
import { useQueryClient } from '@tanstack/react-query';

const Page = ({ children }: {
  children: React.ReactNode
}) => {
  const socket = useSocket();
  const notif = useNotif();
  const showInvitationCard = useShowInvitationCard();
  const confirmation = useConfirmation();
  const router = useRouter();
  const queryClient = useQueryClient();

  // sockets
  useEffect(() => {
    socket.emit('hello', socket.id);
    console.log('hello socket');

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [socket]);

  // update invitations list
  const updateInvitationsList = useCallback(() => {
    // update the invitations list cache memory
    queryClient.invalidateQueries({ queryKey: ['get_invitations'], refetchType: 'all'});
  }, [queryClient])

  // register socket events
  useEffect(() => {


    // handlers
    function handleInvitationSend(data: InvitationAcceptDataType) {
      // update invitation list
      updateInvitationsList();

      // set notif
      notif?.setNotif({
        Node: () => {
          const handleClick = useCallback(() => {
            console.log(data);
            showInvitationCard?.setShowInvitationCard(data);
            notif.setNotif(null);
          }, [])

          return (
            <>
              <div className='h-full min-h-0 min-w-0'>
                <h1>{getFirstName(data.fromName)} invites you to a game.</h1>
                <p className='text-xs text-fore2 truncate max-w-100'>{data.data.message}</p>
              </div>

              <div className="absolute top-0 left-0 h-full w-full">
                <Button className="w-full h-full" click={() => handleClick()} />
              </div>
            </>
          )
        },
      })
    }

    function handleInvitationAccepted(data: InvitationAcceptDataType) {
      // check for /play  path
      console.log('to confirm');
      if (window.location.pathname.split('/')[2]?.includes('play')) {
        console.log('play true');
        return notif?.setNotif({
          Node: () => {
            const handleClick = useCallback(() => {
              console.log(data);
              confirmation?.setConfirmation(data);
              notif.setNotif(null);
            }, [])

            return (
              <>
                <div className='h-full min-h-0 min-w-0'>
                  <h1>{getFirstName(data.fromName)} accepted your invitation, you can confirm it and play on another tab.</h1>
                </div>

                <div className="absolute top-0 left-0 h-full w-full">
                  <Button className="w-full h-full" onClick={() => handleClick()} />
                </div>
              </>
            )
          },
        })
      }

      confirmation?.setConfirmation(data);
    }

    function handleInvitationRejected(data: InvitationAcceptDataType) {
      // update invite list
      updateInvitationsList();

      // also close the confirmation component if opened
      handleCloseConfirm(data);

      // set notification
      notif?.setNotif({
        message: `${getFirstName(data.toName)} rejected your invitation`
      })
    }

    function handleInvitationConfirmed(data: InvitationAcceptDataType) {
      // check if user exits in this socket
      if (!showInvitationCard?.showInvitationCard) {
        return;
      }

      // close invitation card
      showInvitationCard.setShowInvitationCard(null);

      // if not navigate to play
      const params = new URLSearchParams();
      params.set('id', data.fromId || '');
      params.set(data.toId, data.data.pieceColor === 'Black' ? 'White' : 'Black');
      params.set(data.fromId, data.data.pieceColor === 'Black' ? 'Black' : 'White');
      params.set('mode', data.data.mode);

      // check if player is on /plays page
      console.log('in /play', window.location.pathname.toLowerCase(), `/${data.toName.replaceAll(' ', '').toLowerCase()}/play`)
      if (window.location.pathname.toLowerCase() === `/${data.toName.replaceAll(' ', '').toLowerCase()}/play`) {
        return window.open(`/${data.toName.replaceAll(' ', '')}/play?${params.toString()}`)
      }

      router.push(`/${data.toName.replaceAll(' ', '')}/play?${params.toString()}`);
    };

    function handleInvitationCanceled(data: InvitationAcceptDataType) {
      /// if user is waiting for confirm but player cancel
      let fromName: string = data.fromName;
      if (showInvitationCard?.showInvitationCard?.fromId === data.fromId) {
        showInvitationCard.setShowInvitationCard(null);
      }
      
      // if user confirms and goes to /play but player canceled
      const params = new URLSearchParams(window.location.search);
      console.log('user exit in confirming', window.location.pathname, params.toString())
      if (params.get('id') === data.toId) {
        fromName = data.toName;
        router.back();
      }

      // if user is in confirming window but player canceled
      if (confirmation?.confirmation?.toId === data.toId) {
        fromName = data.toName;
        confirmation.setConfirmation(null);
      }

      updateInvitationsList();

      notif?.setNotif({
        message: `${getFirstName(fromName)} canceled the invitation`,
      })
    }

    function handleCloseConfirm(data: InvitationAcceptDataType) {
      console.log('close confirm', confirmation?.confirmation?.toId === data.toId);
      if (confirmation?.confirmation?.toId === data.toId) {
        confirmation.setConfirmation(null);
      }
    }

    function handleInvitationBlocked(data: string) {
      notif?.setNotif({
        message: data
      })
    }

    // invitation was blocked
    socket.on('invitation:blocked', handleInvitationBlocked);

    // recieves an invitation
    socket.on('invitation:send', handleInvitationSend);

    // invitation accepted
    socket.on('invitation:accept', handleInvitationAccepted);

    // invitation rejected
    socket.on('invitation:reject', handleInvitationRejected);
    
    // invitation confirmed
    socket.on('invitation:confirm', handleInvitationConfirmed);

    // invitation cancelled
    socket.on('invitation:cancel', handleInvitationCanceled);
    
    // if the user is the one who invites and he has multiple tabs, close the confirmation on all of those tabs
    socket.on('invitation:closeConfirm', handleCloseConfirm);
    
    return () => {
      socket.off('invitation:closeConfirm', handleCloseConfirm);
      socket.off('invitation:cancel', handleInvitationCanceled);
      socket.off('invitation:confirm', handleInvitationConfirmed);
      socket.off('invitation:reject', handleInvitationRejected);
      socket.off('invitation:accept', handleInvitationAccepted);
      socket.off('invitation:send', handleInvitationSend);
    }
  }, [updateInvitationsList, socket, notif, showInvitationCard, confirmation, router])

  return (
    <UserDetailsProvider>
    <GameDetailsContextProvider>
    <div className='h-dvh w-dvw min-w-0 min-h-0 flex flex-col'>

      {/** topsection */}
      <TopSection />

      {/** everything else */}
      <div className='w-full flex-1 min-w-0 min-h-0'>
        {children}
      </div>

      {/** invitation card */
        showInvitationCard?.showInvitationCard && <InvitationCard showInvitationCard={showInvitationCard} />
      }

      {// confirmation card
        confirmation?.confirmation && <Confirmation confirmation={confirmation} />
      }
    </div>
    </GameDetailsContextProvider>
    </UserDetailsProvider>
  )
}

export default Page;