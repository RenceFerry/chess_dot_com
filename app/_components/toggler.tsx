'use client';

import clsx from 'clsx';
import Button from '@/_components/wrappers/button';

type ButtonProps = {
  active: boolean;
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Toggler = ({ active, name, ...props }: ButtonProps) => {
  return (
    <Button bgspan='fore/20' type='button' {...props} title={active ? 'disable' : 'enable'} className={clsx('w-12 border-4 rounded-full flex flex-row cursor-pointer', {
      'justify-end bg-brown2 border-brown2': active,
      'justify-start bg-back border-back': !active
    })}>
      <input title='toggler' type='checkbox' defaultChecked={active} name={name} className='w-full h-full rounded-full opacity-0 absolute top-0 left-0' />
      <div className='rounded-full h-5 w-5 bg-back4' />
    </Button>
  )
}

export default Toggler;