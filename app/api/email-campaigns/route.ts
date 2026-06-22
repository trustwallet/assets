import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.emailCampaign.findMany({include:{steps:true,events:true}}))} export async function POST(req:Request){return NextResponse.json(await prisma.emailCampaign.create({data:await req.json()}),{status:201})}
