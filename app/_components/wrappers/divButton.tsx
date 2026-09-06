'use client';

import { useRef } from 'react';

type divProps = {
  children?: React.ReactNode;
  bgspan?: string;
  click?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const DivButton = ({ children, bgspan = 'fore/40', click, ...props }: divProps ) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (click) click();

    const span = document.createElement('span');
    span.style.backgroundColor = `var(--${bgspan.split('/')[0]})`;
    span.style.opacity = `${bgspan.split('/')[1] || 100}%`;
    span.className = `feedbak-span rounded-[inherit] absolute w-full h-full top-0 left-0 z-100`;
    console.log(bgspan);
    
    e.currentTarget.appendChild(span);
    
    setTimeout(() => {
      span.remove();
    }, 200);
  }

  return (
    <div id='div-button-feedback' onClick={onClick} ref={divRef} {...props}>
      {children}
    </div>
  )
}

export default DivButton;