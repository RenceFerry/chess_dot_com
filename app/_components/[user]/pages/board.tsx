'use client';

import clsx from 'clsx';
import { RefObject, useEffect, useState } from 'react';
import chessPieces from '@/_lib/chessPieces';
import type { IconType } from 'react-icons';

const alphaLabels = 'abcdefgh';
const pos = 'rnbqkbnr/p1pppppp/1p6/8/8/4P3/PPPP1PPP/RNBQKBNR';

const Board = ({ containerRef, stream = false }: { containerRef: RefObject<HTMLElement | null>; stream?: boolean }) => {
  const [ isWidthGreater, setIsWidthGreater ]  = useState(false);
  const [ board, setBoard ] = useState<string[][] | null>(null);

  {/** change board base on window size */}
  useEffect(() => {
    const windowResize = () => {
      if (containerRef.current) {
        setIsWidthGreater(containerRef.current.clientWidth > containerRef.current.clientHeight);
      }
    }

    window.addEventListener('resize', windowResize);

    windowResize();

    return () => {
      window.removeEventListener('resize', windowResize);
    }
  });

  {/** format board */}
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (!board) {
        const f1Board = pos.split(' ')[0].split('/');
        const f2Board: string[][] = [];

        for (const r of f1Board) {
          const row: string[] = [];

          for (const c of r) {
            if (/^[1-8]$/.test(c)) {
              for (let i = 0; i < parseInt(c); i++) {
                row.push('');
              }
            } else {
              row.push(c);
            }
          }

          f2Board.push(row);
        }

        setBoard(f2Board);
      }
    }, 100);
    console.log(board);

    return () => {
      clearTimeout(timeOut);
    }
  }, [board]);

  return (
    <div className={clsx('m-auto aspect-square flex flex-col rounded-2xl relative p-5', {
      'w-full': !isWidthGreater,
      'h-full': isWidthGreater
    })}>

      {/** num labels */}
      <div className='absolute flex flex-col-reverse h-full top-0 py-5 font-semibold left-2'>
        {
          Array.from({ length: 8 }).map((_, i) => (
            <h2 className='flex-1 text-fore1 flex flex-col justify-center' key={i}>{i + 1}</h2>
          ))
        }
      </div>

      <div className='absolute flex flex-col-reverse h-full py-5 top-0 right-2 font-semibold'>
        {
          Array.from({ length: 8 }).map((_, i) => (
            <h2 className='flex-1 text-fore1 flex flex-col justify-center' key={i}>{i + 1}</h2>
          ))
        }
      </div>

      {/** alpha labels */}
      <div className='absolute flex flex-row w-full left-0 -bottom-0.5 px-5 font-semibold'>
        {
          alphaLabels.split('').map((l, i) => (
            <h2 className='flex-1 text-fore1 justify-center flex' key={i}>{l}</h2>
          ))
        }
      </div>

      <div className='absolute flex flex-row w-full left-0 px-5 font-semibold -top-0.5'>
        {
          alphaLabels.split('').map((l, i) => (
            <h2 className='flex-1 text-fore1 flex justify-center' key={i}>{l}</h2>
          ))
        }
      </div>
      

      {/** board rows */}
      <div className="flex flex-col w-full h-full rounded-2xl overflow-clip">
        {
          Array.from({ length: 8 }).map((_,  i) => (
            <div className={clsx('flex-1 flex flex-row w-full')} key={i}>
              {
                //board tiles
                Array.from({ length: 8 }).map((_, j) => {
                  const piece = board ? board[i][j] : null;
                  //@ts-expect-error don't worry its correct
                  const PieceIcon: IconType | null = piece ? chessPieces[piece.toLowerCase()] : null;
                  return (
                    <div className={clsx('flex-1 h-full flex justify-center items-center relative z-1',{
                      'bg-brown1 hover:brightness-75': (i % 2 == 0 && j % 2 == 0) ||
                      (i % 2 != 0 && j % 2 != 0),
                      'bg-brown3 hover:brightness-80': (i % 2 != 0 && j % 2 == 0) ||
                      (i % 2 == 0 && j % 2 != 0),
                      'cursor-grab': piece && !stream
                      })} key={j}> 

                      { // svg piece
                        PieceIcon && (
                          <PieceIcon className={clsx('h-[60%] w-[60%] z-3', {
                            'text-gray-900': piece === piece?.toLowerCase(),
                            'text-gray-100': piece === piece?.toUpperCase(),
                          })} />
                        )
                      }

                      { // for past moves tiles
                        ((i == 5 && j == 4) || (i == 6  && j == 4)) && (
                          <div className='absolute top-0 left-0 h-full w-full bg-blue-400 opacity-50 z-2' />
                        )
                      }

                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Board;
