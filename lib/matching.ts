type RetireeForMatch = { propertyPreference?: any; lifestylePreference?: any };
type PropertyForMatch = { propertyType: string; bedrooms: number; privatePool: boolean; project: { location: string; submarket?: string | null }; financials?: { listPrice: any } | null; scores?: any | null; lifestyle?: any | null };
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const importance = (n?: number | null) => Math.max(1, Math.min(10, n ?? 5)) / 10;
function budgetScore(price: number, min?: number, max?: number) { if (!price || (!min && !max)) return 70; if (min && price < min) return clamp(100 - ((min - price) / min) * 40); if (max && price > max) return clamp(100 - ((price - max) / max) * 100); return 100; }
function locationScore(locations: string[] = [], project: PropertyForMatch['project']) { if (!locations.length) return 70; const haystack = `${project.location} ${project.submarket ?? ''}`.toLowerCase(); return locations.some((location) => haystack.includes(location.toLowerCase())) ? 100 : 25; }
function bedroomScore(bedrooms: number, min?: number, max?: number) { if (min && bedrooms < min) return clamp(100 - (min - bedrooms) * 30); if (max && bedrooms > max) return clamp(100 - (bedrooms - max) * 20); return 100; }
export function calculatePropertyMatch(retiree: RetireeForMatch, property: PropertyForMatch) {
  const pref = retiree.propertyPreference ?? {}; const scores = property.scores ?? {}; const lifestyle = retiree.lifestylePreference ?? {};
  const price = Number(property.financials?.listPrice ?? 0); const preferredLocations = Array.isArray(pref.preferredLocations) ? pref.preferredLocations : [];
  const criteria = [
    { name: 'Budget', weight: 1.4, score: budgetScore(price, Number(pref.minBudget ?? 0) || undefined, Number(pref.maxBudget ?? 0) || undefined) },
    { name: 'Bedrooms', weight: 1, score: bedroomScore(property.bedrooms, pref.minBedrooms, pref.maxBedrooms) },
    { name: 'Property Type', weight: 1, score: !pref.propertyType || pref.propertyType === property.propertyType ? 100 : 35 },
    { name: 'Location', weight: 1.25, score: locationScore(preferredLocations, property.project) },
    { name: 'Healthcare', weight: 1.2, score: scores.healthcareScore ?? 50 },
    { name: 'Airport Access', weight: importance(pref.airportImportance), score: scores.airportScore ?? 50 },
    { name: 'Safety', weight: 1.15, score: scores.safetyScore ?? 50 },
    { name: 'Lifestyle', weight: 1, score: scores.lifestyleScore ?? 50 },
    { name: 'Expat Community', weight: 0.9, score: scores.expatScore ?? 50 },
    { name: 'Private Pool', weight: pref.privatePoolRequired ? 1 : 0.2, score: !pref.privatePoolRequired || property.privatePool ? 100 : 0 },
    { name: 'Golf/Beach Lifestyle', weight: 0.6, score: clamp(((lifestyle.golf ? Number(property.lifestyle?.golfScore ?? 50) : 50) + (lifestyle.beachLifestyle ? Number(property.lifestyle?.beachScore ?? 50) : 50)) / 2) }
  ];
  const weighted = criteria.reduce((sum, c) => sum + c.score * c.weight, 0); const weight = criteria.reduce((sum, c) => sum + c.weight, 0);
  return { matchScore: clamp(weighted / weight), criteria };
}
