import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
const include = { financialProfile: true, visaRequirement: true, propertyPreference: true, healthcarePreference: true, lifestylePreference: true, travelPreference: true, activities: true, tasks: true, profileNotes: true };
export async function GET() { return NextResponse.json(await prisma.retiree.findMany({ include, orderBy: { updatedAt: 'desc' } })); }
export async function POST(req: Request) { return NextResponse.json(await prisma.retiree.create({ data: await req.json(), include }), { status: 201 }); }
