import { Priority } from '@/types';

export interface AIAnalysisInput {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  communitySupport?: number;
  severity?: number;
  environmentalImpact?: number;
  peopleAffected?: number;
  urgency?: number;
}

export interface AIAnalysisResult {
  department: string;
  severity: number;
  environmentalImpact: number;
  peopleAffected: number;
  urgency: number;
  communitySupport: number;
  impactScore: number;
  priority: Priority;
  aiExplanation: string;
}

// ROUTING MATRIX
export function classifyDepartment(category: string, text: string): string {
  const cat = category.toLowerCase();
  const txt = text.toLowerCase();

  if (
    cat.includes('garbage') ||
    cat.includes('waste') ||
    cat.includes('dumping') ||
    cat.includes('burning') ||
    txt.includes('garbage') ||
    txt.includes('waste') ||
    txt.includes('trash') ||
    txt.includes('dump')
  ) {
    return 'Waste Management';
  }

  if (
    cat.includes('pothole') ||
    cat.includes('road') ||
    cat.includes('pavement') ||
    txt.includes('pothole') ||
    txt.includes('road') ||
    txt.includes('asphalt') ||
    txt.includes('crack')
  ) {
    return 'Roads Department';
  }

  if (
    cat.includes('streetlight') ||
    cat.includes('electric') ||
    cat.includes('light') ||
    txt.includes('streetlight') ||
    txt.includes('lamp') ||
    txt.includes('wire') ||
    txt.includes('dark')
  ) {
    return 'Electrical Department';
  }

  if (
    cat.includes('drainage') ||
    cat.includes('waterlogging') ||
    cat.includes('sewer') ||
    txt.includes('drain') ||
    txt.includes('waterlog') ||
    txt.includes('sewage') ||
    txt.includes('clog')
  ) {
    return 'Drainage Department';
  }

  if (
    cat.includes('water') ||
    cat.includes('leakage') ||
    cat.includes('pipe') ||
    txt.includes('pipe') ||
    txt.includes('leak') ||
    txt.includes('water supply')
  ) {
    return 'Water Department';
  }

  return 'Municipal Works';
}

// IMPACT SCORE & PRIORITY ENGINE
export function calculateImpactScore(input: AIAnalysisInput): AIAnalysisResult {
  const department = classifyDepartment(input.category, `${input.title} ${input.description}`);

  // Derived or defaulted metrics (1 to 5 scale) based on keywords if not provided
  let severity = input.severity || 3;
  let environmentalImpact = input.environmentalImpact || 3;
  let peopleAffected = input.peopleAffected || 3;
  let urgency = input.urgency || 3;
  const communitySupport = input.communitySupport ?? 1;

  const text = `${input.title} ${input.description} ${input.category}`.toLowerCase();

  // Heuristic adjustments based on keywords for realistic demo scoring
  if (text.includes('school') || text.includes('hospital') || text.includes('market') || text.includes('main road')) {
    peopleAffected = Math.max(peopleAffected, 4);
    urgency = Math.max(urgency, 4);
  }
  if (text.includes('toxic') || text.includes('chemical') || text.includes('waste burning') || text.includes('sewage overflow')) {
    environmentalImpact = 5;
    severity = Math.max(severity, 4);
  }
  if (text.includes('dangerous') || text.includes('accident') || text.includes('open wire') || text.includes('open drain')) {
    severity = 5;
    urgency = 5;
  }
  if (text.includes('small') || text.includes('minor') || text.includes('side street')) {
    peopleAffected = Math.min(peopleAffected, 2);
  }

  // Formula: 
  // Severity (20%) + Env Impact (25%) + People Affected (25%) + Urgency (15%) + Support (15%)
  const supportBonus = Math.min(communitySupport * 2.5, 15);
  const baseComponent =
    (severity / 5) * 20 +
    (environmentalImpact / 5) * 25 +
    (peopleAffected / 5) * 25 +
    (urgency / 5) * 15;

  const rawScore = baseComponent + supportBonus;
  const impactScore = Math.min(Math.max(Math.round(rawScore), 10), 100);

  let priority: Priority = 'MEDIUM';
  if (impactScore >= 80) priority = 'CRITICAL';
  else if (impactScore >= 60) priority = 'HIGH';
  else if (impactScore >= 40) priority = 'MEDIUM';
  else priority = 'LOW';

  // Natural Language AI Explanation
  const factors: string[] = [];
  if (environmentalImpact >= 4) factors.push(`High environmental/sanitation hazard (${environmentalImpact}/5)`);
  if (peopleAffected >= 4) factors.push(`Affects large population/transit corridor (${peopleAffected}/5)`);
  if (urgency >= 4) factors.push(`Requires immediate safety intervention (${urgency}/5)`);
  if (communitySupport > 5) factors.push(`Strong community verification (${communitySupport} citizen supporters)`);
  if (factors.length === 0) factors.push(`Standard civic maintenance report`);

  const aiExplanation = `Priority set to ${priority} (Score: ${impactScore}/100) due to: ${factors.join(', ')}. Automatically routed to ${department}.`;

  return {
    department,
    severity,
    environmentalImpact,
    peopleAffected,
    urgency,
    communitySupport,
    impactScore,
    priority,
    aiExplanation,
  };
}

// HAVERSINE PROXIMITY CALCULATOR (in meters)
export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const rad1 = (lat1 * Math.PI) / 180;
  const rad2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad1) * Math.cos(rad2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// DUPLICATE & CLUSTER DETECTION ENGINE
export function findMatchingCluster(
  category: string,
  latitude: number,
  longitude: number,
  existingClusters: { id: string; category: string; latitude: number; longitude: number }[],
  maxRadiusMeters: number = 350
): string | null {
  for (const cluster of existingClusters) {
    if (cluster.category.toLowerCase() === category.toLowerCase()) {
      const dist = getDistanceInMeters(latitude, longitude, cluster.latitude, cluster.longitude);
      if (dist <= maxRadiusMeters) {
        return cluster.id;
      }
    }
  }
  return null;
}
