'use client';

import Button from "@/_components/wrappers/button";
import { IoArrowBackSharp } from "react-icons/io5";
import { useState } from "react";
import clsx from 'clsx';
import InvitationsDivs from "./invitationsDivs";
import { useQuery } from "@tanstack/react-query";
import { getInvitations } from "@/_utils/serverActions/fetchActions";
import { InvitationAcceptDataType, Mode, PieceColor } from "@/_lib/types";
import useUserDet from "@/_lib/context/userDetailsContext";
import { InvitationSkeleton } from '@/_components/skeletons';
import { IoReload } from "react-icons/io5";

const Invitaions = ({ handleBack }: { handleBack: () => void }) => {
  const [ showSent, setShowSent ] = useState(true);
  const userDet = useUserDet();

  console.log('hello invitations');
  
  const { data: sent, isError: sentError, isPending: sentPending, isFetching: sentFetching, refetch: sentRefetch } = useQuery({
    queryKey: ['get_invitations', 'sent'],
    queryFn: async () => {
      const { data, error } = await getInvitations('sent');
      if ( error || !data) throw Error(error || '');

      const invitations: InvitationAcceptDataType[] | undefined = data.filter((invitation) => invitation).map((invitation) => {
        const res = JSON.parse(invitation as unknown as string);
        return {
          fromId: userDet.id,
          fromName: userDet.name,
          toId: res.toId as string,
          toName: res.toName as string,
          data: {
            mode: res.mode as Mode,
            ex: res.ex as number,
            message: res.message as string,
            pieceColor: res.pieceColor as PieceColor
          }
        }
      })

      console.log(invitations);

      return invitations;
    },
    staleTime: 1000 * 60 * 2.5
  })

  const { data: received, isError: receivedError, isPending: receivedPending, isFetching: receivedFetching, refetch: receivedRefetch } = useQuery({
    queryKey: ['get_invitations', 'received'],
    queryFn: async () => {
      const { data, error } = await getInvitations('received');
      if ( error || !data) throw Error(error || '');

      const invitations: InvitationAcceptDataType[] | undefined = data.filter((invitation) => invitation).map((invitation) => {
        const res = JSON.parse(invitation as unknown as string);
        return {
          fromId: res.fromId as string,
          fromName: res.fromName as string,
          toId: res.toId as string,
          toName: res.toName as string,
          data: {
            mode: res.mode as Mode,
            ex: res.ex as number,
            message: res.message as string,
            pieceColor: res.pieceColor as PieceColor
          }
        }
      })

      console.log(invitations);

      return invitations;
    },
    staleTime: 1000 * 60 * 2.5
  })

  const handleReload = () => {
    if (showSent) sentRefetch();
    else receivedRefetch();
  }

  return (
    <div className="flex w-full h-full min-w-0 min-h-0 flex-col">

      {/** header title */}
      <div className="flex flex-row w-full justify-between items-center md:px-10 px-5 py-5">

        {/** back button */}
        <Button bgspan='fore/20' type='button' click={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-2xl md:text-3xl' />
        </Button>

        {/** sent or received */}
        <div className='flex flex-row font-bold'>
          
          {/** sent button switch to received */}
          <Button bgspan='fore/20' click={() => setShowSent(true)} className={clsx('px-4 py-2', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': showSent,
            'text-fore1 bg-back4': !showSent,
          })}>
            <h1>Sent</h1>
          </Button>

          {/** followers button switch to followers */}
          <Button bgspan='fore/20' click={() => setShowSent(false)} className={clsx('py-2 px-4', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': !showSent,
            'text-fore1 bg-back4': showSent,
          })}>
            <h1>Received</h1>
          </Button>

        </div>

        {/** reload button */}
        <Button bgspan='fore/20' type='button' click={handleReload} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoReload className='text-2xl md:text-3xl' />
        </Button>

      </div>

      {/** main section */}
      <div className="flex-1 w-full flex-col flex gap-2">

        {/** title */}
        <h1 className="text-md md:text-xl self-center">Invitations</h1>

        {/** container */}
        <div className="w-full flex flex-1 flex-col items-center justify-start gap-3">
          { showSent ? 
              sentPending || sentFetching ?
                <InvitationSkeleton />
              : sentError ?
                <p className="text-fore2 mt-20">Error loading invitations</p>
              : sent.length === 0 ?
                <p className="text-fore2 mt-20">Nothing here</p>
              :
                <InvitationsDivs sent={showSent} invitations={sent}/>
            : 
              receivedPending || receivedFetching ?
                <InvitationSkeleton />
              : receivedError ?
                <p className="text-fore2 mt-20">Error loading invitations</p>
              : received.length === 0 ?
                <p className="text-fore2 mt-20">Nothing here</p>
              :
                <InvitationsDivs sent={showSent} invitations={received}/>
          }
        </div>
      </div>
    </div>
  )
}

export default Invitaions;