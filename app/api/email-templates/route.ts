import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json(await prisma.emailTemplate.findMany({ orderBy: { name: 'asc' } })); }
export async function POST(req: Request) { return NextResponse.json(await prisma.emailTemplate.create({ data: await req.json() }), { status: 201 }); }
