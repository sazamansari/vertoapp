import { jwtVerify, SignJWT } from 'jose';

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
