
import 'server-only';
import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@/_lib/types";
import { cookies } from "next/headers";
import { cache } from 'react';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (e) {
    return null;
  }
}

export async function createSession(userId: string, name: string) {
  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await  encrypt({ userId, expireAt, name });
  const cookie = await cookies();

  cookie.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expireAt,
    sameSite: 'lax',
    path: '/'
  })
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session) {
    return null;
  }

  return { isAuth: true, userId: session.userId }
})

export async function deleteSession() {
  const cookie = await cookies();

  cookie.delete('session');
}