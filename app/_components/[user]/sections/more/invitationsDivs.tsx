'use client';

import clsx from "clsx";
import Button from "@/_components/wrappers/button";

const InvitationsDivs = ({ sent }: { sent: boolean }) => {

  return (
    <>
      { // card
        Array.from({ length: 10}).map((_, i) => (
          <Button key={i} className='w-95/100 max-w-200 h-16 bg-back2 rounded-lg gap-2 hover:bg-back hover:scale-102 duration-75 transition-all ease-in-out items-center flex justify-between px-3'>

            {/** to name */}
            <h1 className='text-fore3 font-normal text-sm'>{ sent ? "To" : "From"}: &nbsp;&nbsp;&nbsp;<span className='text-lg text-brown1'>Jahsreal</span></h1>

            {/** mode */}
            <h1 className='text-fore2 font-normal text-lg'>Rapid</h1>

            {/** expiraton */}
            <h1 className='text-fore3 font-normal text-sm'><span className={clsx('text-lg', {
              'text-green2': true,
              "text-error": !true
            })}>3m 5s</span>&nbsp;&nbsp;&nbsp; remaining</h1>

          </Button>
        ))
      }
    </>
  )
}

export default InvitationsDivs;