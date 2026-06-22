import { prisma } from '@/lib/prisma';import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json(await prisma.project.findMany({include:{developer:true,properties:true}}))} export async function POST(req:Request){return NextResponse.json(await prisma.project.create({data:await req.json()}),{status:201})}
