import { decrypt } from '@/_utils/sessions';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ['/login', '/signup', '/verifyEmail'];
const privateRoutes = /^(\/)[^/?]+(\?tab=)(play|home|streams|more)$/i;

export default async function proxy(req: NextRequest)
{
  const path = req.nextUrl.pathname; 
  let wholePath = req.nextUrl.pathname;
  if (req.nextUrl.searchParams.toString()) wholePath += ('?' + req.nextUrl.searchParams.toString());

  const session = (await cookies()).get('session')?.value;
  const decrypted = await decrypt(session);
  const urlUser = wholePath.split('?')[0];
  const afterPath = wholePath.split('?')[1] || 'tab=home';

  //console.log(wholePath);

  if (
    privateRoutes.test(wholePath) ||
    (urlUser === '/' + decrypted?.name &&
    wholePath.split('?').length === 0)
  )
  {
    if (decrypted && urlUser !== '/' + decrypted.name) 
    {
      return NextResponse.redirect(new URL(`/${decrypted.name}?${afterPath}`, req.nextUrl));
    }

    if (!decrypted)
    {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
  } 

  //console.log(publicRoutes.includes(wholePath));

  if (publicRoutes.includes(path)) 
  {
    if (decrypted) {
      return NextResponse.redirect(new URL(`/${decrypted.name}?tab=home`, req.nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  if (path !== '/notFound') {
    return NextResponse.redirect(new URL(`/notFound?url=${req.nextUrl.basePath+wholePath}`, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}