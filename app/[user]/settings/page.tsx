'use client';

import { IoArrowBackSharp } from 'react-icons/io5';

import { usePathname, useRouter } from 'next/navigation';
import Button from '@/_components/wrappers/button';
import Toggler from '@/_components/toggler';
import { useState } from 'react';
import ChangePassword from '@/_components/[user]/pages/settings/changePassword';

const Page = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [ active, setActive ] = useState(false);
  const [ showPasswordChange, setShowPasswordChange ] = useState(false);

  // handle back clicking
  function handleBack() 
  {
    const param = new URLSearchParams();
    param.set('tab', 'more');
    router.replace(`/${pathname.split('/')[1]}?${param.toString()}`);
  }
  return (
    <div className='w-full h-full min-h-0 min-w-0 flex flex-col bg-back4 rounded-t-3xl relative overflow-hidden'>
      
      {/** top section */} 
      <div className='flex flex-row p-3 md:p-5 justify-between items-center w-full text-brown1'>
        {/** back */}
        <Button bgspan='fore/20' type='button' onClick={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-2xl md:text-3xl' />
        </Button>

        {/** title */}
        <h1 className='text-xl font-bold'>Settings</h1>

        <div className='h-10 w-10' />
      </div>

      <main className='w-full flex-1 min-h-0 min-w-0 flex flex-col items-center p-5 gap-4'>

        {/** account */}
        <div className='w-full max-w-150 flex flex-col'>

          {/** label */}
          <h1 className='text-brown2 text-sm md:text-mds'>Account</h1>

          {/** items */}
          <Button onClick={() => setShowPasswordChange(true)} bgspan='fore/10' className='w-full flex flex-row justify-between items-center p-2 hover:bg-back3 text-fore1.s'>
            <h1>Change Password</h1>
          </Button>
        </div>

        {/** preferences */}
        <div className='w-full max-w-150 flex flex-col'>

          {/** label */}
          <h1 className='text-brown2 text-sm md:text-mds'>Preference</h1>

          {/** items */}
          <div className='w-full flex flex-row justify-between items-center p-2 hover:bg-back3 text-fore1.s'>
            <h1>Set streaming as default when playing</h1>

            <Toggler active={active} setActive={setActive} />
          </div>

          <div className='w-full flex flex-row justify-between items-center p-2 hover:bg-back3 text-fore1.s'>
            <h1>Disable chat when playing</h1>

            <Toggler active={active} setActive={setActive} />
          </div>

          <div className='w-full flex flex-row justify-between items-center p-2 hover:bg-back3 text-fore1.s'>
            <h1>Make chats private when streaming</h1>

            <Toggler active={active} setActive={setActive} />
          </div>
        </div>
      </main>

      { // change password card
        showPasswordChange &&
        <ChangePassword close={() => setShowPasswordChange(false)} />
      }
    </div>
  )
}

export default Page;