import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const clusters = await db.cluster.findMany({
      include: {
        issues: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
            impactScore: true,
            createdAt: true,
          },
        },
      },
      orderBy: [{ impactScore: 'desc' }, { reportCount: 'desc' }],
    });

    return NextResponse.json(clusters);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch clusters' }, { status: 500 });
  }
}
