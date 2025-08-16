import { generateNonce } from 'siwe';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const nonce = generateNonce();
    
    // Set nonce in a HTTP-only cookie
    const response = NextResponse.json({ nonce });
    response.cookies.set('siwe_nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 5 // 5 minutes
    });

    return response;
  } catch (error) {
    console.error('Nonce generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}
