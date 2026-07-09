import { prisma } from '@/lib/prisma';
import { ArrowUpRight, Bot, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Home, MapPin, MessageSquareText, ShieldCheck, Sparkles, Users } from 'lucide-react';

const formatCurrency = (value: number) => `฿${value.toLocaleString()}`;
const formatDate = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? 'TBD';

export default async function Dashboard() {
  const [projects, properties, avg, areas, units, handovers, leads, activeClients, pipeline, visa, followUps] = await Promise.all([
    prisma.project.count(),
    prisma.property.count(),
    prisma.propertyScores.aggregate({ _avg: { retirementScore: true } }),
    prisma.project.groupBy({ by: ['location'], _count: true, take: 8 }),
    prisma.project.aggregate({ _sum: { unitsAvailable: true } }),
    prisma.project.findMany({ where: { handoverDate: { gte: new Date() } }, take: 6, orderBy: { handoverDate: 'asc' } }),
    prisma.retiree.count(),
    prisma.retiree.count({ where: { leadStage: { notIn: ['LEAD', 'CLOSED', 'POST_PURCHASE'] } } }),
    prisma.financialProfile.aggregate({ _sum: { investmentBudget: true } }),
    prisma.visaRequirement.count({ where: { visaStatus: { not: null } } }),
    prisma.task.findMany({ where: { status: { not: 'DONE' }, dueDate: { gte: new Date() } }, include: { retiree: true }, take: 6, orderBy: { dueDate: 'asc' } }),
  ]);

  const pipelineValue = Number(pipeline._sum.investmentBudget ?? 0);
  const averageScore = Math.round(avg._avg.retirementScore ?? 0);
  const availableUnits = units._sum.unitsAvailable ?? 0;

  const cards = [
    { label: 'Total Leads', value: leads.toLocaleString(), detail: 'Inbound retirees captured', icon: Users, tone: 'from-cyan-500 to-blue-600' },
    { label: 'Active Clients', value: activeClients.toLocaleString(), detail: 'In advisory motion', icon: ShieldCheck, tone: 'from-emerald-500 to-teal-600' },
    { label: 'Pipeline Value', value: formatCurrency(pipelineValue), detail: 'Qualified investment budget', icon: CircleDollarSign, tone: 'from-amber-400 to-orange-500' },
    { label: 'Properties Matched', value: properties.toLocaleString(), detail: 'Curated inventory options', icon: Home, tone: 'from-violet-500 to-fuchsia-600' },
  ];

  const intelligence = [
    { label: 'Visa readiness coverage', value: visa, copy: 'Profiles with visa signals ready for advisor follow-up.' },
    { label: 'Average retirement fit', value: `${averageScore}%`, copy: 'AI suitability score across property matches.' },
    { label: 'Available units', value: availableUnits, copy: 'Supply the co-investor assistant can recommend now.' },
    { label: 'Live projects', value: projects, copy: 'Developments available for co-investor shortlisting.' },
  ];

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-2xl shadow-cyan-950/10 backdrop-blur">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" /> AI-native co-investor cockpit
            </div>
            <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Turn retiree intent into confident Thailand property decisions.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              AkarAI now presents the highest-impact advisory signals first: client momentum, budget-weighted pipeline, visa readiness, property fit, and the next best human action.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5" href="/dashboard/ai">
                Open AI Advisor <ArrowUpRight className="h-4 w-4" />
              </a>
              <a className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-300" href="/dashboard/pipeline">
                Review Pipeline
              </a>
            </div>
          </div>

          <div className="relative min-h-80 rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/30">
            <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.35),transparent_16rem),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.25),transparent_12rem)]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-100/80">Illustrative AI journey map</p>
                  <h3 className="mt-1 text-2xl font-black">Investor match flow</h3>
                </div>
                <Bot className="h-10 w-10 text-cyan-200" />
              </div>
              <div className="mt-8 space-y-4">
                {['Capture goals', 'Score property fit', 'Validate visa path', 'Generate co-invest memo'].map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-slate-950">0{index + 1}</div>
                    <div className="flex-1">
                      <p className="font-bold">{step}</p>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${48 + index * 14}%` }} />
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, tone }) => (
          <div className="card group overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-2xl" key={label}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{detail}</p>
              </div>
              <div className={`rounded-2xl bg-gradient-to-br ${tone} p-3 text-white shadow-lg`}><Icon className="h-5 w-5" /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Market map</p>
              <h3 className="mt-1 text-2xl font-black">Properties by preferred area</h3>
            </div>
            <MapPin className="h-8 w-8 text-cyan-500" />
          </div>
          <div className="mt-6 space-y-4">
            {areas.length ? areas.map((area) => {
              const count = Number(area._count);
              const width = Math.min(100, Math.max(12, count * 12));
              return <div key={area.location}>
                <div className="flex justify-between text-sm font-bold"><span>{area.location}</span><span>{count}</span></div>
                <div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${width}%` }} /></div>
              </div>;
            }) : <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">No area data yet. Add projects to populate the visual market map.</p>}
          </div>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">AI insight stack</p>
          <h3 className="mt-1 text-2xl font-black">Decision confidence</h3>
          <div className="mt-5 space-y-4">
            {intelligence.map((item) => <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4" key={item.label}>
              <p className="text-2xl font-black text-slate-950">{item.value}</p>
              <p className="mt-1 font-bold text-slate-700">{item.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{item.copy}</p>
            </div>)}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-amber-500" /><h3 className="text-2xl font-black">Upcoming handovers</h3></div>
          <div className="mt-5 space-y-3">
            {handovers.length ? handovers.map((handover) => <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4" key={handover.id}><span className="font-bold">{handover.projectName}</span><span className="text-sm font-semibold text-slate-500">{formatDate(handover.handoverDate)}</span></div>) : <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">No upcoming handovers are scheduled.</p>}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3"><Clock3 className="h-6 w-6 text-cyan-500" /><h3 className="text-2xl font-black">Next best follow-ups</h3></div>
          <div className="mt-5 space-y-3">
            {followUps.length ? followUps.map((task) => <div className="rounded-2xl border border-slate-100 p-4" key={task.id}><div className="flex items-start justify-between gap-4"><b>{task.title}</b><span className="text-sm font-semibold text-slate-500">{formatDate(task.dueDate)}</span></div><p className="mt-1 text-sm text-slate-500">{task.retiree.firstName} {task.retiree.lastName}</p></div>) : <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">No pending follow-ups. AkarAI will surface new next-best actions here.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-cyan-100 bg-cyan-950 p-6 text-white shadow-2xl shadow-cyan-950/20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">UX recommendation</p>
            <h3 className="mt-2 text-3xl font-black">Make every screen explain the advisor action.</h3>
            <p className="mt-3 leading-7 text-cyan-50/80">The revised homepage uses an illustrative journey card, prioritized metrics, progress bars, and empty states so users understand what the AI is doing and what they should do next.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Explain score drivers', 'Show next actions', 'Pair data with visuals'].map((item) => <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold" key={item}><MessageSquareText className="mb-3 h-5 w-5 text-amber-200" />{item}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
