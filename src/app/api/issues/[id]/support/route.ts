import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateImpactScore } from '@/lib/ai-engine';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    const userId = session?.id || 'usr-cit-2';

    const issue = await db.issue.findUnique({
      where: { id },
      include: { supports: true },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Check if user already supported
    const existingSupport = await db.issueSupport.findUnique({
      where: {
        issueId_userId: { issueId: id, userId },
      },
    });

    let newSupportCount = issue.communitySupport;

    if (existingSupport) {
      // Toggle off / remove support
      await db.issueSupport.delete({
        where: { id: existingSupport.id },
      });
      newSupportCount = Math.max(1, newSupportCount - 1);
    } else {
      // Add support
      await db.issueSupport.create({
        data: { issueId: id, userId },
      });
      newSupportCount += 1;
    }

    // Recalculate AI Impact Score with new support volume
    const aiRescore = calculateImpactScore({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      latitude: issue.latitude,
      longitude: issue.longitude,
      severity: issue.severity,
      environmentalImpact: issue.environmentalImpact,
      peopleAffected: issue.peopleAffected,
      urgency: issue.urgency,
      communitySupport: newSupportCount,
    });

    // Update Issue & Cluster
    const updatedIssue = await db.issue.update({
      where: { id },
      data: {
        communitySupport: newSupportCount,
        impactScore: aiRescore.impactScore,
        priority: aiRescore.priority,
        aiExplanation: aiRescore.aiExplanation,
      },
    });

    if (issue.clusterId) {
      await db.cluster.update({
        where: { id: issue.clusterId },
        data: {
          supporterCount: { increment: existingSupport ? -1 : 1 },
        },
      });
    }

    return NextResponse.json(updatedIssue);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update support' }, { status: 500 });
  }
}
