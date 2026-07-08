import { decrypt } from '@/_utils/sessions';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ['/', ''];
const partialRoutes = ['/login', '/signup', '/verifyEmail'];

const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

const privateRoutes = new RegExp(
  '^' +
  '(?<user>\\/[^/?]+)' +                                // /user
  '(' +
    '\\/' + '(?<path1>play)' +                   // /play or /stream
    '\\?' +                                             // ?
    '(?=.*id=(?<uuid>' + uuid + '))' +      // lookahead: id=uui(order-independent)  
    '[^#]*' +                                           // consume query string
  '|' +
    '\\/' + '(?<path2>followers|settings|stream)[^#]*'  +            // /followers or /settings or /stream with query strings
  '|' +
    '(?<usertab>\\?tab=(?:play|home|more|streams))' +   // ?tab=...
  ')?' +                          // whole suffix is optional (matches bare /user)
  '$',
  'i'
);

//   ab131434-1817-40ed-81a4-44db0bf503c8

export default async function proxy(req: NextRequest)
{
  const path = req.nextUrl.pathname;
  
  console.log(path);
  let wholePath = req.nextUrl.pathname;
  if (req.nextUrl.searchParams.toString()) wholePath += ('?' + req.nextUrl.searchParams.toString());

  const session = (await cookies()).get('session')?.value;
  const decrypted = await decrypt(session);
  const urlUser = path.split('/')[1];
  const afterPath = wholePath.split('?')[1] || 'tab=home';

  const name = decrypted?.name as string;

  console.log(wholePath, privateRoutes.test(wholePath));

  if (
    privateRoutes.test(wholePath) ||

    //test /user && /user/
    ( decrypted &&
    urlUser.toLowerCase() === name.toLowerCase() &&
    (path.split('/').length === 2 ||
    (path.split('/').length === 3 && path.split('/')[2] === ''
    )))
  )
  {
    console.log('hello private')

    if (decrypted && urlUser !== name)
    {
      if (!(path.split('/')[2] === undefined || path.split('/')[2] === '')) {
        return NextResponse.redirect(new URL(`/${name}/${path.split('/')[2]}`, req.nextUrl));
      }
      return NextResponse.redirect(new URL(`/${name}?${afterPath}`, req.nextUrl));
    }

    if (!decrypted)
    {
      console.log('redirecting to login');
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
  } 

  if (partialRoutes.includes(path)) 
  {
    console.log('hello partial')

    if (decrypted) {
      return NextResponse.redirect(new URL(`/${decrypted.name}?tab=home`, req.nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  if (publicRoutes.includes(path)) {
    console.log("hello public")
    return NextResponse.next();
  }

  if (path !== '/notFound') {
    return NextResponse.redirect(new URL(`/notFound?url=${req.nextUrl.basePath + wholePath}`, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}