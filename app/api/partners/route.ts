import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.partner.findMany({include:{referrals:true},orderBy:{name:'asc'}}))} export async function POST(req:Request){return NextResponse.json(await prisma.partner.create({data:await req.json()}),{status:201})}
