import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function PUT(req: Request, { params }: { params: { id: string } }) { return NextResponse.json(await prisma.emailTemplate.update({ where: { id: params.id }, data: await req.json() })); }
export async function DELETE(_: Request, { params }: { params: { id: string } }) { await prisma.emailTemplate.delete({ where: { id: params.id } }); return new NextResponse(null, { status: 204 }); }
