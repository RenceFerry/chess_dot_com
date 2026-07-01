'use client';

import React from 'react'
import clsx from 'clsx';
import Button from '@/_components/wrappers/button';

const Toggler = ({ active, setActive }: { active: boolean; setActive: (active: boolean ) => void}) => {
  return (
    <Button bgspan='fore/20' type='button' title={active ? 'disable' : 'enable'} onClick={() => setActive(!active)} className={clsx('w-12 border-4 rounded-full flex flex-row cursor-pointer', {
      'justify-end bg-brown2 border-brown2': active,
      'justify-start bg-back border-back': !active
    })}>
      <div className='rounded-full h-5 w-5 bg-back4' />
    </Button>
  )
}

export default Toggler;