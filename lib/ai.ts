import { prisma } from '@/lib/prisma';
import { calculatePropertyMatch } from '@/lib/matching';

export type AiChatInput = { type: 'ADVISOR' | 'CLIENT' | 'PROPERTY_RECOMMENDATION' | 'VISA_GUIDANCE' | 'RETIREMENT_PLANNING'; question: string; retireeId?: string; model?: string };
export async function runOpenAICompatibleChat(input: AiChatInput) {
  const promptName = input.type === 'PROPERTY_RECOMMENDATION' ? 'property_recommender' : input.type === 'VISA_GUIDANCE' ? 'visa_guidance' : 'retirement_advisor';
  const prompt = await prisma.aiPrompt.findFirst({ where: { name: promptName, isActive: true }, orderBy: { version: 'desc' } });
  const model = input.model || prompt?.model || process.env.OPENAI_COMPATIBLE_MODEL || 'gpt-4o-mini';
  const messages = [{ role: 'system', content: prompt?.systemPrompt || 'You are TRLA, a Thailand retirement relocation advisor.' }, { role: 'user', content: input.question }];
  let response = 'AI provider not configured. Set OPENAI_COMPATIBLE_BASE_URL and OPENAI_COMPATIBLE_API_KEY to enable live responses.';
  if (process.env.OPENAI_COMPATIBLE_BASE_URL && process.env.OPENAI_COMPATIBLE_API_KEY) {
    const result = await fetch(`${process.env.OPENAI_COMPATIBLE_BASE_URL}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_COMPATIBLE_API_KEY}` }, body: JSON.stringify({ model, messages }) });
    const json = await result.json(); response = json.choices?.[0]?.message?.content ?? response;
  }
  await prisma.aiConversation.create({ data: { retireeId: input.retireeId, promptId: prompt?.id, type: input.type, model, messages, response } });
  return { model, response };
}
export async function generateTopRecommendations(retireeId: string) {
  const retiree = await prisma.retiree.findUniqueOrThrow({ where: { id: retireeId }, include: { propertyPreference: true, lifestylePreference: true } });
  const properties = await prisma.property.findMany({ include: { project: true, financials: true, scores: true, lifestyle: true } });
  return properties.map((property) => {
    const match = calculatePropertyMatch(retiree, property as any); const confidenceScore = Math.min(98, Math.round(match.matchScore * 0.8 + Number(property.scores?.retirementScore ?? 60) * 0.2));
    return { property, matchScore: match.matchScore, confidenceScore, explanation: `${property.propertyCode} aligns with budget, location, lifestyle, healthcare, and safety preferences at ${match.matchScore}%.`, pros: match.criteria.filter((c) => c.score >= 80).map((c) => c.name), cons: match.criteria.filter((c) => c.score < 55).map((c) => c.name), risks: match.criteria.filter((c) => c.score < 40).map((c) => `${c.name} requires advisor review`) };
  }).sort((a, b) => b.confidenceScore - a.confidenceScore).slice(0, 20);
}
