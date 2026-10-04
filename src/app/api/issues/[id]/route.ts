import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const issue = await db.issue.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        supports: true,
        cluster: {
          include: {
            issues: {
              select: { id: true, title: true, status: true, impactScore: true, createdAt: true },
            },
          },
        },
        updates: {
          include: { updatedBy: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch issue details' }, { status: 500 });
  }
}
