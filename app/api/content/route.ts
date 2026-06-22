import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.contentItem.findMany({orderBy:{createdAt:'desc'}}))} export async function POST(req:Request){return NextResponse.json(await prisma.contentItem.create({data:await req.json()}),{status:201})}
