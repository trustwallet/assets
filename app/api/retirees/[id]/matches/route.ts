import { prisma } from '@/lib/prisma';
import { calculatePropertyMatch } from '@/lib/matching';
import { NextResponse } from 'next/server';
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url); const minMatch = Number(url.searchParams.get('minMatch') ?? 0); const location = url.searchParams.get('location'); const type = url.searchParams.get('propertyType');
  const retiree = await prisma.retiree.findUniqueOrThrow({ where: { id: params.id }, include: { propertyPreference: true, lifestylePreference: true } });
  const properties = await prisma.property.findMany({ include: { project: true, financials: true, scores: true, lifestyle: true, media: true } });
  const matches = properties.map((property) => ({ property, ...calculatePropertyMatch(retiree, property as any) }))
    .filter((match) => match.matchScore >= minMatch)
    .filter((match) => !location || `${match.property.project.location} ${match.property.project.submarket ?? ''}`.toLowerCase().includes(location.toLowerCase()))
    .filter((match) => !type || match.property.propertyType === type)
    .sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
  return NextResponse.json(matches);
}
