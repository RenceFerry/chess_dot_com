'use client';

import { useState } from "react";
import Button from "@/_components/wrappers/button";
import { IoClose } from 'react-icons/io5';
import { LuEye, LuEyeClosed } from 'react-icons/lu';

const ChangePassword = ({ close }: { close: () => void }) => {
  const [ showPasswords, setShowPasswords ] = useState({
    current: false,
    new: false
  })

  return (
    <div className='absolute z-100 rounded-[inherit] w-full h-full flex justify-center items-center backdrop-blur-xs bg-black/10 p-5'>

      {/** actual card */}
      <div className='w-full max-w-100 border border-brown2 bg-back4 rounded-lg flex flex-col'>

        {/** top section */}
        <div className='flex flex-row p-3 justify-between items-center'>

          {/** title */}
          <h1 className='text-brown1'>Change your password</h1>

          {/** close */}
          <Button bgspan='fore/20' onClick={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
            <IoClose className='text-fore2 text-xl' />
          </Button>
        </div>

        {/** content */}
        <form className='flex flex-col py-2 px-10 gap-3 items-center w-full'>

          {/** current pass */}
          <div className='w-full flex flex-col'>
            <label htmlFor="currentPass" className='text-fore2 text-sm md:text-md'>Current Password</label>

            <div className='relative w-full'>
              <input type={showPasswords.current ? 'text' : 'password'} className='w-full p-2 rounded-md bg-back2' placeholder='current password' />

              <button onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current})} type='button' title={showPasswords.current ? 'hide' : 'show'} className='hover:text-fore cursor-pointer text-fore2 absolute top-0 right-0 h-full mr-5 flex flex-col justify-center'>
                {
                  showPasswords.current ?
                  <LuEyeClosed className='text-xl' /> :
                  <LuEye className='text-xl' /> 
                }
              </button>
            </div>
          </div>

          {/** new pass */}
          <div className='w-full flex flex-col'>
            <label htmlFor="currentPass" className='text-fore2 text-sm md:text-md'>New Password</label>

            <div className='relative w-full'>
              <input type={showPasswords.new ? 'text' : 'password'} className='w-full p-2 rounded-md bg-back2' placeholder='new password' />

              <button onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new})} type='button' title={showPasswords.new ? 'hide' : 'show'} className='hover:text-fore cursor-pointer text-fore2 absolute top-0 right-0 h-full mr-5 flex flex-col justify-center'>
                {
                  showPasswords.new ?
                  <LuEyeClosed className='text-xl' /> :
                  <LuEye className='text-xl' /> 
                }
              </button>
            </div>
          </div>

          {/** confirm new pass */}
          <div className='w-full flex flex-col'>
            <label htmlFor="currentPass" className='text-fore2 text-sm md:text-md'>Confirm New Password</label>

            <div className='relative w-full'>
              <input type={'password'} className='w-full p-2 rounded-md bg-back2' placeholder='new password' />
            </div>
          </div>

          {/** submit button */}
          <div className='w-full flex flex-row justify-end'>
            <Button type='submit' bgspan='fore/20' className='py-2 px-4 rounded-md bg-brown2 text-back4 font-semibold'>Change</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword;