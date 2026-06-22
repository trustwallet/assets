import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
const include = { financialProfile: true, visaRequirement: true, propertyPreference: true, healthcarePreference: true, lifestylePreference: true, travelPreference: true, activities: { orderBy: { activityDate: 'desc' } }, tasks: { orderBy: { dueDate: 'asc' } }, profileNotes: { orderBy: { createdAt: 'desc' } } };
export async function GET(_: Request, { params }: { params: { id: string } }) { return NextResponse.json(await prisma.retiree.findUniqueOrThrow({ where: { id: params.id }, include })); }
export async function PUT(req: Request, { params }: { params: { id: string } }) { return NextResponse.json(await prisma.retiree.update({ where: { id: params.id }, data: await req.json(), include })); }
export async function DELETE(_: Request, { params }: { params: { id: string } }) { await prisma.retiree.delete({ where: { id: params.id } }); return new NextResponse(null, { status: 204 }); }
