'use client';
import { useMemo, useState } from 'react';
import { leadStages, stageLabels } from '@/lib/crm';

type Card = { id: string; firstName: string; lastName: string; leadStage: string; nationality?: string | null; financialProfile?: { investmentBudget?: unknown } | null; propertyPreference?: { preferredLocations: string[] } | null };
export function KanbanBoard({ initialRetirees }: { initialRetirees: Card[] }) {
  const [cards, setCards] = useState(initialRetirees); const [dragging, setDragging] = useState<string | null>(null);
  const byStage = useMemo(() => Object.fromEntries(leadStages.map((stage) => [stage, cards.filter((card) => card.leadStage === stage)])), [cards]);
  async function moveCard(id: string, leadStage: string) { setCards((items) => items.map((item) => item.id === id ? { ...item, leadStage } : item)); await fetch(`/api/retirees/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadStage }) }); }
  return <div className="mt-6 flex gap-4 overflow-x-auto pb-4">{leadStages.map((stage) => <div key={stage} onDragOver={(event) => event.preventDefault()} onDrop={() => dragging && moveCard(dragging, stage)} className="min-w-72 rounded-2xl bg-slate-100 p-3"><h3 className="mb-3 font-bold">{stageLabels[stage]}</h3>{byStage[stage].map((retiree) => <a href={`/dashboard/retirees/${retiree.id}`} draggable onDragStart={() => setDragging(retiree.id)} className="mb-3 block rounded-xl bg-white p-4 shadow-sm" key={retiree.id}><b>{retiree.firstName} {retiree.lastName}</b><p className="text-sm text-slate-500">฿{Number(retiree.financialProfile?.investmentBudget ?? 0).toLocaleString()} · {retiree.nationality ?? '—'}</p><p className="text-sm">{retiree.propertyPreference?.preferredLocations.join(', ') || 'No preferred area'}</p><span className="mt-2 inline-block rounded-full bg-brand-50 px-2 py-1 text-xs text-brand-700">{stageLabels[stage]}</span></a>)}</div>)}</div>;
}
