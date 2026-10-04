import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, setSessionCookie, clearSessionCookie } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ user: session });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    // Fast demo login support for pre-seeded users
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      // Create user on the fly if signing up or demo account
      user = await db.user.create({
        data: {
          name: email.split('@')[0].toUpperCase(),
          email,
          password: password || 'password123',
          role: role === 'AUTHORITY' ? 'AUTHORITY' : 'CITIZEN',
          department: role === 'AUTHORITY' ? 'Waste Management' : null,
        },
      });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'CITIZEN' | 'AUTHORITY',
      department: user.department,
    };

    await setSessionCookie(sessionUser);
    return NextResponse.json({ success: true, user: sessionUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 400 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
