import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json(await prisma.developerSubmission.findMany({ include: { developer: true }, orderBy: { createdAt: 'desc' } })); }
export async function POST(req: Request) { return NextResponse.json(await prisma.developerSubmission.create({ data: await req.json() }), { status: 201 }); }
