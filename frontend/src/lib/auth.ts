import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { AUTH_COOKIE } from '@/features/auth/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-replace-me';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function signJwt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(encodedSecret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(AUTH_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getSessionCookie() {
  return (await cookies()).get(AUTH_COOKIE)?.value;
}

export async function deleteSessionCookie() {
  (await cookies()).delete(AUTH_COOKIE);
}
