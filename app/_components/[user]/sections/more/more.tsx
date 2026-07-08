'use client';

import { useState } from 'react'
import { GiShadowFollower } from "react-icons/gi";
import { FaRobot } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";

import AccountWindow from './account';
import Button from '@/_components/wrappers/button';
import Link from 'next/link';

const More = () => {
  const [ accountWindowHidden, setAccountWindowHidden ] = useState<boolean>(true);

  return (
    <div className='h-full w-full flex flex-row justify-start items-start text-fore1 font-semibold relative'>

      <div className='flex-1 flex flex-col p-8 gap-6 h-full'>

        {/** personal group */}
        <div className='w-full flex flex-col gap-2'>

          {/** label */}
          <h1 className='text-brown1/50 text-sm md:text-md px-3'>Personal</h1>

          {/** account details */}
          <Button bgspan='fore/10' type='button' onClick={() => setAccountWindowHidden(false)} className='cursor-pointer w-full h-10 flex px-2 items-center flex-row hover:bg-back2 gap-5'>
            <CgDetailsMore className='text-2xl text-brown2' />
            <h1>Account</h1>
          </Button>

          {/** followers */}
          <Button bgspan='fore/10' className='cursor-pointer w-full h-10'>
            <Link href='/user/followers' className='w-full h-full flex px-2 items-center flex-row hover:bg-back2 gap-5'>
              <GiShadowFollower className='text-2xl text-brown2' />
              <h1>Followers / Following</h1>
            </Link>
          </Button>
        </div>

        {/** play group */}
        <div className='flex flex-col w-full gap-2'>

          {/** label */}
          <h1 className='text-sm md:text-md text-brown1/50 px-3'>Play</h1>

          {/** play bot */}
          <Button bgspan='fore/10' className='cursor-pointer w-full h-10 flex px-2 items-center flex-row hover:bg-back2 gap-5'>
            <FaRobot className='text-2xl text-brown2' />
            <h1>Play Against Bot</h1>
          </Button>

          {/** player against player */}
          <Button bgspan='fore/10' className='cursor-pointer w-full h-10 flex px-2 items-center flex-row hover:bg-back2 gap-5'>
            <MdPeopleAlt className='text-2xl text-brown2' />
            <h1>Player Vs Player</h1>
          </Button>
        </div>

        {/** settings group */}
        <div className='flex flex-col w-full gap-2'>

          {/** label */}
          <h1 className='text-sm md:text-md text-brown1/50 px-3'>Settings</h1>

          {/** settings */}
          <Button bgspan='fore/10' className='cursor-pointer w-full h-10'>
            <Link href='/user/settings' className='flex px-2 items-center flex-row hover:bg-back2 gap-5 w-full h-full'>
              <MdOutlineSettings className='text-2xl text-brown2' />
              <h1>Settings</h1>
            </Link>
          </Button>
        </div>
      </div>

      {/** edit profile window */
        !accountWindowHidden && (
          <AccountWindow close={() => setAccountWindowHidden(true)} />
        )
      }


    </div>
  )
}

export default More;