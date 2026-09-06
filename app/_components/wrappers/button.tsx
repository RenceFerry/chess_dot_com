'use client';

import { useEffect, useRef } from 'react';

type ButtonProps = {
  children?: React.ReactNode;
  bgspan?: string;
  click?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, bgspan = 'fore/40', click, ...props }: ButtonProps ) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => 
  {
    if (buttonRef.current) 
    {
      const button = buttonRef.current;
      button.addEventListener('click', (e) => 
      {
        e.stopPropagation();
        if (click) click();
        const span = document.createElement('span');
        span.style.backgroundColor = `var(--${bgspan.split('/')[0]})`;
        span.style.opacity = `${bgspan.split('/')[1] || 100}%`;
        span.className = `feedbak-span rounded-[inherit] absolute w-full h-full top-0 left-0 z-100`;
        console.log(bgspan);
        
        button.appendChild(span);
        
        setTimeout(() => {
          span.remove();
        }, 200);
      });
    }
  }, [bgspan, click]);

  return (
    <button id='button-feedback' ref={buttonRef} {...props}>
      {children}
    </button>
  )
}

export default Button;