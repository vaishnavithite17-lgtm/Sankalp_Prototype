import { cookies } from 'next/headers';
import { UserSession } from '@/types';

const AUTH_COOKIE = 'sankalp_auth_session';

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE);
    if (!sessionCookie || !sessionCookie.value) return null;
    return JSON.parse(sessionCookie.value) as UserSession;
  } catch (e) {
    return null;
  }
}

export async function setSessionCookie(user: UserSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
