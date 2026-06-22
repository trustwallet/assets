import { runOpenAICompatibleChat } from '@/lib/ai';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? '';
  const body = contentType.includes('form') ? Object.fromEntries(await req.formData()) : await req.json();
  return NextResponse.json(await runOpenAICompatibleChat({ type: String(body.type ?? 'ADVISOR') as any, question: String(body.question ?? ''), retireeId: body.retireeId ? String(body.retireeId) : undefined, model: body.model ? String(body.model) : undefined }));
}
