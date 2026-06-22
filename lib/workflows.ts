import { prisma } from '@/lib/prisma';
export async function triggerWorkflow(eventType: any, payload: Record<string, unknown>, retireeId?: string) {
  const automations = await prisma.workflowAutomation.findMany({ where: { eventType, enabled: true } });
  const runs = [];
  for (const automation of automations) {
    let status: 'SENT' | 'FAILED' | 'COMPLETED' = automation.webhookUrl ? 'SENT' : 'COMPLETED'; let response = automation.webhookUrl ? undefined : 'No webhook configured; recorded as internal workflow.';
    if (automation.webhookUrl) { try { const res = await fetch(automation.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventType, payload }) }); response = await res.text(); status = res.ok ? 'SENT' : 'FAILED'; } catch (error) { status = 'FAILED'; response = String(error); } }
    runs.push(await prisma.workflowRun.create({ data: { automationId: automation.id, retireeId, payload, status, response } }));
  }
  return runs;
}
