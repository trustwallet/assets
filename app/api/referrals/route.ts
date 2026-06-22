import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.referral.findMany({include:{referredRetiree:true}}))} export async function POST(req:Request){return NextResponse.json(await prisma.referral.create({data:await req.json()}),{status:201})}
