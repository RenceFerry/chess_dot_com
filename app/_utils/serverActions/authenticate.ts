'use server';

import { cookies } from 'next/headers';
import { decrypt } from '../sessions';
import type { SessionPayload } from '@/_lib/types';

export const authenticate = async () => {
  const cookie = await cookies();
  const session = cookie.get('session')?.value;
  const decrypted = await decrypt(session);

  if (!decrypted) {
    return null;
  }

  return decrypted as SessionPayload;
}