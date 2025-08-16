import { NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { cookies } from 'next/headers';
import { generateNonce } from 'siwe';

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json();
    const cookieStore = cookies();
    const nonce = cookieStore.get('siwe_nonce')?.value;

    if (!nonce) {
      return NextResponse.json(
        { error: 'Invalid nonce' },
        { status: 400 }
      );
    }

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature, nonce });

    if (!fields.success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Create a new session
    const newNonce = generateNonce();
    const response = NextResponse.json({ ok: true });

    // Set session cookie
    response.cookies.set('siwe_session', fields.data.address, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Update nonce
    response.cookies.set('siwe_nonce', newNonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 5 // 5 minutes
    });

    return response;
  } catch (error) {
    console.error('Verify failed:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
