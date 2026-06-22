import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.marketingMetric.findMany({orderBy:{date:'desc'},take:200}))} export async function POST(req:Request){return NextResponse.json(await prisma.marketingMetric.create({data:await req.json()}),{status:201})}
