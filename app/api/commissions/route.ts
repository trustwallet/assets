import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.commission.findMany({include:{developer:true,property:true,retiree:true,revenueOpportunity:true}}))} export async function POST(req:Request){return NextResponse.json(await prisma.commission.create({data:await req.json()}),{status:201})}
