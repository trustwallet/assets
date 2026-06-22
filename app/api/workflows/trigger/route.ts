import { triggerWorkflow } from '@/lib/workflows';
import { NextResponse } from 'next/server';
export async function POST(req: Request) { const { eventType, payload, retireeId } = await req.json(); return NextResponse.json(await triggerWorkflow(eventType, payload ?? {}, retireeId)); }
