import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Status } from '@/types';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const userId = session?.id || 'usr-auth-1';

    const body = await req.json();
    const { status, comment, proofImageUrl } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const issue = await db.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Update issue status
    const updatedIssue = await db.issue.update({
      where: { id },
      data: {
        status: status as Status,
      },
    });

    // Also update unified cluster status if resolved
    if (issue.clusterId && status === 'RESOLVED') {
      await db.cluster.update({
        where: { id: issue.clusterId },
        data: { status: 'RESOLVED' },
      });
    }

    // Add Timeline Update & Resolution Proof
    await db.issueUpdate.create({
      data: {
        issueId: id,
        status: status as Status,
        comment: comment || `Status updated to ${status} by ${session?.department || 'Department Authority'}.`,
        proofImageUrl: proofImageUrl || (status === 'RESOLVED' ? 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80' : null),
        updatedById: userId,
      },
    });

    return NextResponse.json(updatedIssue);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update issue status' }, { status: 500 });
  }
}
