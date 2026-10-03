import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic civic data...');

  // Clean existing tables
  await prisma.issueUpdate.deleteMany();
  await prisma.issueSupport.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.cluster.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const citizen1 = await prisma.user.create({
    data: {
      id: 'usr-cit-1',
      name: 'Ananya Sharma',
      email: 'citizen@civic.gov',
      password: 'password123',
      role: 'CITIZEN',
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      id: 'usr-cit-2',
      name: 'Rohan Mehta',
      email: 'rohan@civic.gov',
      password: 'password123',
      role: 'CITIZEN',
    },
  });

  const authorityWaste = await prisma.user.create({
    data: {
      id: 'usr-auth-1',
      name: 'Rajesh Kumar (Waste Mgmt Officer)',
      email: 'authority@civic.gov',
      password: 'password123',
      role: 'AUTHORITY',
      department: 'Waste Management',
    },
  });

  const authorityRoads = await prisma.user.create({
    data: {
      id: 'usr-auth-2',
      name: 'Sunil Verma (PWD Roads Officer)',
      email: 'roads@civic.gov',
      password: 'password123',
      role: 'AUTHORITY',
      department: 'Roads Department',
    },
  });

  // Seed Clusters (Unified Issues)
  const garbageCluster = await prisma.cluster.create({
    data: {
      id: 'cls-1',
      title: 'Unified Issue: Massive Waste Dumping — XYZ School Zone',
      category: 'Garbage / Waste',
      latitude: 18.5204,
      longitude: 73.8567,
      status: 'IN_PROGRESS',
      department: 'Waste Management',
      reportCount: 4,
      supporterCount: 42,
      priority: 'CRITICAL',
      impactScore: 89.0,
    },
  });

  const potholeCluster = await prisma.cluster.create({
    data: {
      id: 'cls-2',
      title: 'Unified Issue: Severe Road Crater — MG Road Junction',
      category: 'Pothole / Road Damage',
      latitude: 18.5284,
      longitude: 73.8741,
      status: 'ASSIGNED',
      department: 'Roads Department',
      reportCount: 3,
      supporterCount: 28,
      priority: 'HIGH',
      impactScore: 76.5,
    },
  });

  // Create Issues
  const issue1 = await prisma.issue.create({
    data: {
      id: 'iss-101',
      title: 'Garbage hotspot & open dumping near City High School',
      description:
        'Large accumulating heap of plastic waste and unsegregated household garbage blocking the walkway outside City High School gate. Attracting stray animals and creating severe stench.',
      category: 'Garbage / Waste',
      latitude: 18.5204,
      longitude: 73.8567,
      imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef7693a4ca8?auto=format&fit=crop&w=800&q=80',
      status: 'IN_PROGRESS',
      department: 'Waste Management',
      severity: 4,
      environmentalImpact: 5,
      peopleAffected: 5,
      urgency: 4,
      communitySupport: 42,
      impactScore: 89.0,
      priority: 'CRITICAL',
      aiExplanation:
        'Priority set to CRITICAL (Score: 89/100) due to: High environmental/sanitation hazard (5/5), Affects large population/transit corridor (5/5), Requires immediate safety intervention (4/5), Strong community verification (42 citizen supporters). Automatically routed to Waste Management.',
      clusterId: garbageCluster.id,
      createdById: citizen1.id,
    },
  });

  const issue1Duplicate = await prisma.issue.create({
    data: {
      id: 'iss-101b',
      title: 'Smelly trash pile blocking pavement near school',
      description:
        'Reporting the same waste dump on XYZ Road near the school gate. Mosquito breeding risk during monsoon.',
      category: 'Garbage / Waste',
      latitude: 18.5206,
      longitude: 73.8569,
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      status: 'IN_PROGRESS',
      department: 'Waste Management',
      severity: 4,
      environmentalImpact: 5,
      peopleAffected: 5,
      urgency: 4,
      communitySupport: 15,
      impactScore: 85.0,
      priority: 'CRITICAL',
      aiExplanation:
        'Clustered with Unified Garbage Hotspot — XYZ School Zone due to proximity (25m) and identical category.',
      clusterId: garbageCluster.id,
      createdById: citizen2.id,
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      id: 'iss-102',
      title: 'Deep pothole causing traffic bottleneck on MG Road',
      description:
        'Two foot deep pothole across the right lane of MG Road near Central Mall. Two two-wheelers skidded yesterday.',
      category: 'Pothole / Road Damage',
      latitude: 18.5284,
      longitude: 73.8741,
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      status: 'ASSIGNED',
      department: 'Roads Department',
      severity: 4,
      environmentalImpact: 2,
      peopleAffected: 5,
      urgency: 5,
      communitySupport: 28,
      impactScore: 76.5,
      priority: 'HIGH',
      aiExplanation:
        'Priority set to HIGH (Score: 76.5/100) due to: High accident hazard on primary arterial road (5/5 urgency). Routed to Roads Department.',
      clusterId: potholeCluster.id,
      createdById: citizen2.id,
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      id: 'iss-103',
      title: 'Broken streetlight causing dark alley on 4th Cross St',
      description:
        'Streetlight pole #44 has been dark for 5 days. Women and elderly commuters feel unsafe walking at night.',
      category: 'Broken Streetlight',
      latitude: 18.5142,
      longitude: 73.8431,
      imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
      status: 'REPORTED',
      department: 'Electrical Department',
      severity: 3,
      environmentalImpact: 1,
      peopleAffected: 3,
      urgency: 4,
      communitySupport: 12,
      impactScore: 54.0,
      priority: 'MEDIUM',
      aiExplanation:
        'Priority set to MEDIUM (Score: 54/100) due to localized public safety hazard. Routed to Electrical Department.',
      createdById: citizen1.id,
    },
  });

  const issue4 = await prisma.issue.create({
    data: {
      id: 'iss-104',
      title: 'Severe drainage clogging & sewage overflow near Market Sq',
      description:
        'Black stagnant sewer water overflowing onto pedestrian sidewalk. High risk of waterborne disease outbreak.',
      category: 'Blocked Drainage',
      latitude: 18.5312,
      longitude: 73.8489,
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
      status: 'RESOLVED',
      department: 'Drainage Department',
      severity: 5,
      environmentalImpact: 5,
      peopleAffected: 4,
      urgency: 5,
      communitySupport: 35,
      impactScore: 92.0,
      priority: 'CRITICAL',
      aiExplanation:
        'Priority set to CRITICAL (Score: 92/100) due to severe bio-hazard sewage overflow. Routed to Drainage Department.',
      createdById: citizen2.id,
    },
  });

  const issue5 = await prisma.issue.create({
    data: {
      id: 'iss-105',
      title: 'Main pipeline leak wasting clean drinking water on Park Ave',
      description:
        'Underground freshwater supply line burst spraying water 6 feet high. Thousands of liters being wasted.',
      category: 'Water Leakage',
      latitude: 18.5098,
      longitude: 73.8321,
      imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      status: 'IN_PROGRESS',
      department: 'Water Department',
      severity: 4,
      environmentalImpact: 4,
      peopleAffected: 4,
      urgency: 4,
      communitySupport: 19,
      impactScore: 78.0,
      priority: 'HIGH',
      aiExplanation:
        'Priority set to HIGH (Score: 78/100) due to critical urban water resource loss. Routed to Water Department.',
      createdById: citizen1.id,
    },
  });

  const issue6 = await prisma.issue.create({
    data: {
      id: 'iss-106',
      title: 'Illegal open plastic burning behind residential colony',
      description:
        'Unidentified contractors burning industrial plastic scraps in open plot every evening. Thick toxic black smoke.',
      category: 'Open Waste Burning',
      latitude: 18.5401,
      longitude: 73.8612,
      imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f31?auto=format&fit=crop&w=800&q=80',
      status: 'ASSIGNED',
      department: 'Waste Management',
      severity: 5,
      environmentalImpact: 5,
      peopleAffected: 4,
      urgency: 5,
      communitySupport: 51,
      impactScore: 95.0,
      priority: 'CRITICAL',
      aiExplanation:
        'Priority set to CRITICAL (Score: 95/100) due to direct air pollution violation and toxic smoke exposure to residents.',
      createdById: citizen1.id,
    },
  });

  // Seed Issue Supports
  await prisma.issueSupport.create({
    data: { issueId: issue1.id, userId: citizen2.id },
  });
  await prisma.issueSupport.create({
    data: { issueId: issue4.id, userId: citizen1.id },
  });

  // Seed Issue Resolution Updates with Proof
  await prisma.issueUpdate.create({
    data: {
      issueId: issue1.id,
      status: 'ASSIGNED',
      comment: 'Complaint received and dispatched to Ward 4 Sanitation Crew.',
      updatedById: authorityWaste.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  });

  await prisma.issueUpdate.create({
    data: {
      issueId: issue1.id,
      status: 'IN_PROGRESS',
      comment: 'Sanitation JCB truck dispatched to clear open dump site.',
      updatedById: authorityWaste.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  await prisma.issueUpdate.create({
    data: {
      issueId: issue4.id,
      status: 'RESOLVED',
      comment: 'Super-sucker suction vehicle cleared the main sewer line blockage. Sidewalk sanitized with bleaching powder.',
      proofImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      updatedById: authorityWaste.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
  });

  console.log('Seeding complete! Sample data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
