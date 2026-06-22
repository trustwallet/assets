import { generateTopRecommendations } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) { const { retireeId, persist } = await req.json(); const recommendations = await generateTopRecommendations(retireeId); if (persist) { await prisma.aiRecommendation.createMany({ data: recommendations.map((r) => ({ retireeId, propertyId: r.property.id, matchScore: r.matchScore, confidenceScore: r.confidenceScore, explanation: r.explanation, pros: r.pros, cons: r.cons, risks: r.risks })) }); } return NextResponse.json(recommendations); }
