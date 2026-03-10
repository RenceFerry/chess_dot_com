import prisma from "@/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/_utils/sessions";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: "No code Provided" }, { status: 400 });
  }

  console.log(req.nextUrl, code);

  // exchange code for tokens 
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      grant_type: 'authorization_code'
    })
  })

  const tokens = await tokenRes.json();
  console.log(tokens);

  if (!tokenRes.ok) {
    return NextResponse.json({ error: tokens }, { status: 400 });
  }

  const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',  {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    }
  })

  console.log(userInfo);

  if (!userInfo.ok) {
    return NextResponse.json({ error: 'No user returned' }, { status: userInfo.status });
  }

  const { email, picture, name } = await userInfo.json();

  let dbUser;
  try {
    dbUser = await prisma.users.upsert({   
      where: {
        email
      },
      update: {},
      create: {
        email,
        name,
        image: picture
      },
      select: {
        id: true,
        name: true
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'server error, try again later' }, { status: 500 });
  }

  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 );
  const payload = await encrypt({ userId: dbUser.id, expireAt, name: dbUser.name });

  const response = NextResponse.redirect(new URL('/play', req.nextUrl));

  response.cookies.set('session', payload,  {
    expires: expireAt,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: true
  })

  return response;
}