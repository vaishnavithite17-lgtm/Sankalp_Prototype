import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateImpactScore, findMatchingCluster } from '@/lib/ai-engine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const clusterId = searchParams.get('clusterId');

    const where: any = {};
    if (category) where.category = category;
    if (department) where.department = department;
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (clusterId) where.clusterId = clusterId;

    const issues = await db.issue.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        supports: true,
        cluster: true,
        updates: {
          include: { updatedBy: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [{ impactScore: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(issues);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.id || 'usr-cit-1'; // Default fallback demo citizen

    const body = await req.json();
    const { title, description, category, latitude, longitude, imageUrl, severity, environmentalImpact, peopleAffected, urgency } = body;

    if (!title || !description || !category || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // 1. Run AI Impact & Routing Engine
    const aiResult = calculateImpactScore({
      title,
      description,
      category,
      latitude: lat,
      longitude: lon,
      severity: severity ? parseInt(severity) : 3,
      environmentalImpact: environmentalImpact ? parseInt(environmentalImpact) : 3,
      peopleAffected: peopleAffected ? parseInt(peopleAffected) : 3,
      urgency: urgency ? parseInt(urgency) : 3,
      communitySupport: 1,
    });

    // 2. Run Duplicate / Cluster Detection Engine
    const existingClusters = await db.cluster.findMany({
      select: { id: true, category: true, latitude: true, longitude: true },
    });

    let clusterId = findMatchingCluster(category, lat, lon, existingClusters, 350);

    if (!clusterId) {
      // Create new Unified Cluster for this hotspot location
      const newCluster = await db.cluster.create({
        data: {
          title: `Unified Issue: ${title}`,
          category,
          latitude: lat,
          longitude: lon,
          status: 'REPORTED',
          department: aiResult.department,
          reportCount: 1,
          supporterCount: 1,
          priority: aiResult.priority,
          impactScore: aiResult.impactScore,
        },
      });
      clusterId = newCluster.id;
    } else {
      // Update existing cluster metrics
      await db.cluster.update({
        where: { id: clusterId },
        data: {
          reportCount: { increment: 1 },
          supporterCount: { increment: 1 },
          impactScore: Math.max(aiResult.impactScore, 60.0),
        },
      });
    }

    // 3. Persist Issue in Database
    const newIssue = await db.issue.create({
      data: {
        title,
        description,
        category,
        latitude: lat,
        longitude: lon,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1605600659908-0ef7693a4ca8?auto=format&fit=crop&w=800&q=80',
        status: 'AI_ANALYSED',
        department: aiResult.department,
        severity: aiResult.severity,
        environmentalImpact: aiResult.environmentalImpact,
        peopleAffected: aiResult.peopleAffected,
        urgency: aiResult.urgency,
        communitySupport: 1,
        impactScore: aiResult.impactScore,
        priority: aiResult.priority,
        aiExplanation: aiResult.aiExplanation,
        clusterId,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        cluster: true,
      },
    });

    // Initial system timeline update
    await db.issueUpdate.create({
      data: {
        issueId: newIssue.id,
        status: 'AI_ANALYSED',
        comment: `AI Engine scored impact at ${aiResult.impactScore}/100 (${aiResult.priority}). Automatically assigned to ${aiResult.department}.`,
        updatedById: userId,
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create issue' }, { status: 500 });
  }
}
