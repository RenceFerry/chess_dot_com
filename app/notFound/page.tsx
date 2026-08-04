import React from 'react'
import Link from 'next/link';
import { headers } from 'next/headers';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const origin = `${protocol}://${host}`;
  const params = await searchParams;
  const url = new URL(params.url as string || '');

  return (
    <div className='bg-back3 w-full h-full min-h-0 min-w-0 flex flex-col gap-8 justify-center items-center'>

      <div className='text-center text-fore2 text-lg'>
        <span className='text-xl font-bold mr-2 text-fore'>404 |</span>The page you requested on <br/> <span className='text-fore1 underline'>{url.href}</span> <br/> does not exist.
      </div>

      <Link href={origin} className='underline text-blue-500'>Go Back Home</Link>
    </div>
  )
}

export default Page;