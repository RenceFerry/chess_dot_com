'use client';

import React, { useRef } from 'react'
import { IoSearch } from "react-icons/io5";

const Search = ({ what, setSearch }: { what: string, setSearch: (search: string) => void | React.Dispatch<React.SetStateAction<string>> }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const search = Object.fromEntries(formData.entries()).search as string;
    setSearch(search);
  }

  // auto submit when stops typing 
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value.trim();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSearch(search);
    }, 500);
  }

  return (
    <div className='w-full h-16 flex justify-center sticky bg-back4 z-20 top-0 left-0'>
      <form onSubmit={submit} className='h-full min-w-80 w-[75%] max-w-125 flex flex-row justify-center items-center relative mx-auto'>

        {/** search input */}
        <input onChange={onChange} className='bg-back w-full h-8 md:h-10 px-10 rounded-full outline-none hover:border hover:border-brown2 focus:border focus:border-brown2' title={'search ' + what} name={'search ' + what} type="text" placeholder={`Search ${what}...`} />

        {/** search logo */}
        <div className='h-full absolute top-0 left-0 flex justify-center items-center ml-2'>
          <IoSearch className='text-fore text-xl' />
        </div>

      </form>
    </div>
  )
}

export default Search;