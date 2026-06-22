import { prisma } from '@/lib/prisma';
import { KanbanBoard } from '@/components/KanbanBoard';
export default async function Page() {
  const retirees = await prisma.retiree.findMany({ include: { financialProfile: true, propertyPreference: true }, orderBy: { updatedAt: 'desc' } });
  return <section><h2 className="text-3xl font-bold">Lead Pipeline</h2><p className="mt-2 text-slate-600">Drag cards between stages to update the retiree pipeline, Pipedrive-style.</p><KanbanBoard initialRetirees={retirees as any} /></section>;
}
