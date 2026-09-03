'use client';

import Button from "@/_components/wrappers/button";
import { IoArrowBackSharp } from "react-icons/io5";
import { useState } from "react";
import clsx from 'clsx';
import InvitationsDivs from "./invitationsDivs";
import { useQuery } from "@tanstack/react-query";

const Invitaions = ({ handleBack }: { handleBack: () => void }) => {
  const [ showSent, setShowSent ] = useState(true);

  const { data: sent, isError, isPending, isFetching } = useQuery({
    queryKey: ['getSentInvitations'],
    queryFn: ()
  })

  return (
    <div className="flex w-full h-full min-w-0 min-h-0 flex-col">

      {/** header title */}
      <div className="flex flex-row w-full justify-between items-center md:px-10 px-5 py-5">

        {/** back button */}
        <Button bgspan='fore/20' type='button' onClick={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-2xl md:text-3xl' />
        </Button>

        {/** followers or followed */}
        <div className='flex flex-row font-bold'>
          
          {/** followed button switch to players followed */}
          <Button bgspan='fore/20' onClick={() => setShowSent(true)} className={clsx('px-4 py-2', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': showSent,
            'text-fore1 bg-back4': !showSent,
          })}>
            <h1>Sent</h1>
          </Button>

          {/** followers button switch to followers */}
          <Button bgspan='fore/20' onClick={() => setShowSent(false)} className={clsx('py-2 px-4', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': !showSent,
            'text-fore1 bg-back4': showSent,
          })}>
            <h1>Received</h1>
          </Button>

        </div>

        {/** filler div */}
        <div className="w-12" />

      </div>

      {/** main section */}
      <div className="flex-1 w-full flex-col flex gap-2">

        {/** title */}
        <h1 className="text-md md:text-xl self-center">Invitations</h1>

        {/** container */}
        <div className="w-full flex flex-1 flex-col items-center justify-start gap-3">
          <InvitationsDivs sent={showSent} />
        </div>

      </div>

    </div>
  )
}

export default Invitaions;