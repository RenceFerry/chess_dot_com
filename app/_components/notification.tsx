"use client";

import { useNotif } from "@/_lib/context/notifContext";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import Button from '@/_components/wrappers/button';

const Notification = () => {
  const notif = useNotif();

  useEffect(() => {
    const timer = setTimeout(() => {
      notif?.setNotif(null);
    }, 5000);

    return () => clearTimeout(timer); // cleanup on unmount or re-render
  }, [notif]);

  const abortTimeOut = () => {
    notif?.setNotif(null);
  };

  return (
    <>
      { notif && notif.notif && notif.notif.message ?
          <div className='absolute right-5 top-5 bg-back2 border-brown2 border-3 rounded-3xl min-h-20 min-w-64 flex justify-between items-center flex-row text-fore1 z-1000 overflow-hidden p-4'>

            {/** notif message */}
            <h1 className={`text-md text-${notif?.notif?.color || 'fore'} text-center`}>{notif?.notif?.message}</h1>

            {/** close button */}
            <Button bgspan='fore/20' onClick={abortTimeOut} className='flex justify-center items-center ml-2 h-10 w-10 cursor-pointer hover:bg-back rounded-full hover:text-brown2' type='button' title='close'>
              <IoClose className="text-error1 text-xl md:text-2xl" />
            </Button>

          </div> 
        : notif && notif.notif && notif.notif.Node &&
          <div className="absolute right-5 top-5 bg-back2 border-brown2 border-3 rounded-3xl min-h-20 min-w-64 flex justify-between items-center flex-row text-fore1 z-1000 overflow-hidden p-4  hover:scale-105 transition-all duration-200 ease-in-out text-start cursor-pointer">

            {/** notif node */}
            <notif.notif.Node />

            {/** close button */}
            <Button bgspan='fore/20' onClick={abortTimeOut} className='flex justify-center items-center ml-2 h-10 w-10 cursor-pointer hover:bg-back rounded-full hover:text-brown2' type='button' title='close'>
              <IoClose className="text-error1 text-xl md:text-2xl" />
            </Button>
          </div>
      }
    </>
  );
}

export default Notification;