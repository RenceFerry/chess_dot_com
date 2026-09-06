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
     '\\/(?<path2>followers|settings|stream|play)(?:\\?[^#]*)?'  +            // /followers or /settings or /stream with query strings
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
  // let wholePath = req.nextUrl.pathname;
  // if (req.nextUrl.searchParams.toString()) wholePath += ('?' + req.nextUrl.searchParams.toString());
  const wholePath = req.nextUrl.pathname + req.nextUrl.search;

  const session = (await cookies()).get('session')?.value;
  const decrypted = await decrypt(session);
  const urlUser = path.split('/')[1];
  //const afterPath = wholePath.split('?')[1] || 'tab=home';

  const name = decrypted?.name ? (decrypted.name as string).replaceAll(' ', ''): '';
 
  console.log('test',wholePath, privateRoutes.test(wholePath), urlUser, path);

  // partial routes
  if (partialRoutes.includes(path)) 
  {
    console.log('hello partial')

    if (decrypted) {
      return NextResponse.redirect(new URL(`/${decrypted.name}?tab=home`, req.nextUrl));
    } else {
      return NextResponse.next();
    }
  }

  // private routes
  if (privateRoutes.test(wholePath))
  {
    console.log('hello private')
    if (!decrypted)
    {
      console.log('redirecting to login');
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (urlUser === '::user::') {
      return NextResponse.redirect(new URL(`/${name}`, req.url));
    }

    if (urlUser.toLowerCase() !== name.toLowerCase())
    {
      return NextResponse.rewrite(new URL('/404', req.url));
      // if (!(path.split('/')[2] === undefined || path.split('/')[2] === '')) {
      //   return NextResponse.redirect(new URL(`/${name}/${path.split('/')[2]}`, req.nextUrl));
      // }
      // return NextResponse.redirect(new URL(`/${name}?${afterPath}`, req.nextUrl));
    }

    return NextResponse.next();
  }

  // public routes
  // if (publicRoutes.includes(path)) {
  //   console.log("hello public")
  //   return NextResponse.next();
  // }
  return NextResponse.next();

  //return NextResponse.rewrite(new URL('/404', req.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}