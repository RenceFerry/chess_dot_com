'use client';

import clsx from "clsx";
import Button from "@/_components/wrappers/button";
import DivButton from "@/_components/wrappers/divButton";
import { InvitationAcceptDataType } from "@/_lib/types";
import useConfirmation from "@/_lib/context/confirmationContext";
import { useEffect, useState } from 'react';
import { formatTime, getTime } from "@/_utils/helpers";
import useShowInvitationCard from "@/_lib/context/showInvitationCardContext";

const InvitationsDivs = ({ sent, invitations }: { sent: boolean, invitations: InvitationAcceptDataType[] }) => {
  const confirmation = useConfirmation();
  const showInvitation = useShowInvitationCard();
  // for timers in each card
  const [ now, setNow ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()));

    return () => {
      clearInterval(interval);
    }
  })

  const handleClick = (i: number) => {
    if (sent) confirmation?.setConfirmation({ ...invitations[i], sent: true })
    else showInvitation?.setShowInvitationCard({ ...invitations[i] })
  }

  return (
    <>
      { // card
        invitations.map((invitation, i) => (
          <DivButton key={i} click={() => handleClick(i)}
          className={clsx('w-95/100 max-w-200 h-16 bg-back2 rounded-lg gap-2 hover:bg-back hover:scale-102 duration-75 transition-all ease-in-out items-center flex justify-between px-3 cursor-pointer', 
          {
            'pointer-events-none opacity-70': invitation.data.ex - now < 1
          })}>

            {/** to name */}
            <h1 className='text-fore3 font-normal text-sm w-3/10 max-w-3/10 truncate'>{ sent ? "To" : "From"}: &nbsp;&nbsp;&nbsp;<span className='text-lg text-brown1'>{invitation.toName}</span></h1>

            {/** mode and expirtation */}
            <div className="flex-col center">

              {/** mode */}
              <p className='text-fore2 font-normal text-sm'>{invitation.data.mode}</p>

              {/** expiraton */}
              <p className={clsx('font-normal text-xs', {
                'text-error2': invitation.data.ex - now < 1,
                'text-fore3': invitation.data.ex - now > 1,
              })}>
                {
                  (invitation.data.ex - now > 0) ?
                    <>
                      <span className={clsx('text-xs', 
                      {
                        'text-green2': getTime(invitation.data.ex - now, 'M') > 30,
                        "text-error": (getTime(invitation.data.ex - now, 'M') <+ 30),
                      })}>
                        {formatTime(invitation.data.ex - now)}
                      </span>
                      &nbsp;&nbsp;&nbsp; remaining
                    </>
                  : 'Expired'
                }
              </p>

            </div>

            {/** cancel */}
            <Button className="px-3 py-1 bg-error text-back3 text-sm md:text-md rounded-lg center">
              Cancel
            </Button>

          </DivButton>
        ))
      }
    </>
  )
}

export default InvitationsDivs;