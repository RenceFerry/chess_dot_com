'use client';

import { useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { RiEdit2Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import Image from 'next/image';
import Button from '@/_components/wrappers/button';

const AccountWindow = ({ close }: { close: () => void }) => {
  const [ editAccount, setEditAccount ] = useState<boolean>(false);

  return (
    <div className='absolute flex w-full h-full justify-center items-center backdrop-blur-sm bg-black/40 z-20'>

      {/** actual window */}
      <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-64 w-[65%] max-w-150'>

        {/** title & close button */}
        <div className='w-full flex flex-row p-3 justify-between'>

          {/** title */}
          <h1 className='text-lg text-brown1'>Account details</h1>

          {/** close button */}
          <Button bgspan='fore/20' onClick={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
            <IoClose className='text-fore2 text-xl' />
          </Button>
        </div>

        {/** content */}
        <div className='flex flex-col p-3 justify-start items-center w-full gap-1'>

          {/** avatar container */}
          <Button bgspan='fore/20' className='rounded-full overflow-hidden relative w-[50%] h-auto'>

            {/** edit avatar button */
              editAccount && 
              <div className='w-full absolute top-0 left-0 h-full z-3 grid items-center backdrop-blur-xs bg-black/40'>
                <RiEdit2Line className='text-5xl m-auto' />

                <input type='file' title='change avatar' accept='image/*' className='absolute top-0 left-0 z-3 opacity-0 cursor-grab w-full h-full' />
              </div>
            }

            {/** avatar */}
            <Image unoptimized src={'https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male'} alt='avatar' width={100} height={100} className='rounded-full overflow-hidden w-full bg-brown2 p-1 cursor-pointer' />

          </Button>

          {/** username */}
          <form action="" className='flex flex-col w-full'>
            <fieldset disabled={!editAccount} className='flex flex-col w-full'>
              <div className='flex flex-col gap-2 mt-4 w-full bg-back3 p-1'>
                <label htmlFor='name' className='text-xs text-brown1 md:text-sm'>Name</label>
                <input id='name' name='name' type='text' className='text-fore2 md:text-lg p-2' defaultValue={'John Doe'} />
              </div>

              {/** email */}
              <div className='flex flex-col gap-2 mt-4 w-full bg-back3 p-1'>
                <label htmlFor='email' className='text-xs text-brown1 md:text-sm'>Email</label>
                <input name='email' id='email' type='email' className='text-fore2 md:text-lg p-2' defaultValue={'johndoe@email.com'} />
              </div>
            </fieldset>

            {/** edit button */
              editAccount ? 
              <div className='flex justify-around flex-row w-full mt-4'>

                {/** cancel */}
                <Button bgspan='back4/20' title='cancel' type='button' onClick={close} className='bg-error1 text-sm md:text-lg text-back3 rounded-md w-26 py-2 cursor-pointer flex flex-row justify-center items-center gap-1'>
                  <IoClose />
                  <h1>Cancel</h1>
                </Button>

                {/** save */}
                <Button bgspan='back4/20' title='save' type='submit' className='bg-green1 text-sm md:text-lg text-back3 rounded-md w-26 py-2 cursor-pointer flex flex-row justify-center items-center gap-1'>
                  <FaCheck />
                  <h1>Save</h1>
                </Button>
              </div> :
              <div className='flex justify-end flex-row w-full mt-4'>
                <Button bgspan='fore/20' onClick={() => setEditAccount(true)} type='button' title='edit' className='p-2 hover:bg-brown3 bg-brown2 text-fore1 rounded-full text-2xl md:p-3 md:text-3xl cursor-pointer'>
                  <RiEdit2Line />
                </Button>
              </div>
            }
          </form>
        </div>
      </div>

      {/** view profile */}

    </div>
  )
}

export default AccountWindow;