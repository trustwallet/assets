import {
  BarChart3,
  Bot,
  Building2,
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  Compass,
  FileText,
  Handshake,
  Home,
  LayoutDashboard,
  LineChart,
  Mail,
  Map,
  MessageSquare,
  Plane,
  ScrollText,
  Settings2,
  Sparkles,
  Target,
  Users,
  Workflow,
} from 'lucide-react';

const nav = [
  { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Executive', href: '/dashboard/executive', icon: LineChart },
  { label: 'AI Advisor', href: '/dashboard/ai', icon: Bot },
  { label: 'Pipeline', href: '/dashboard/pipeline', icon: Target },
  { label: 'Retirees', href: '/dashboard/retirees', icon: Users },
  { label: 'Client Portal', href: '/dashboard/client-portal', icon: Compass },
  { label: 'Documents', href: '/dashboard/documents', icon: FileText },
  { label: 'Visa', href: '/dashboard/visa', icon: Plane },
  { label: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
  { label: 'Appointments', href: '/dashboard/appointments', icon: CalendarClock },
  { label: 'Communications', href: '/dashboard/communications', icon: MessageSquare },
  { label: 'Portfolio', href: '/dashboard/portfolio', icon: BarChart3 },
  { label: 'Rentals', href: '/dashboard/rentals', icon: Home },
  { label: 'Developer Portal', href: '/dashboard/developer-portal', icon: Building2 },
  { label: 'Knowledge Base', href: '/dashboard/knowledge-base', icon: ScrollText },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'Growth', href: '/dashboard/growth', icon: Sparkles },
  { label: 'Revenue', href: '/dashboard/revenue', icon: CircleDollarSign },
  { label: 'Commissions', href: '/dashboard/commissions', icon: CircleDollarSign },
  { label: 'Partners', href: '/dashboard/partners', icon: Handshake },
  { label: 'CMS', href: '/dashboard/cms', icon: Settings2 },
  { label: 'Landing Pages', href: '/dashboard/landing-pages', icon: Map },
  { label: 'Lead Magnets', href: '/dashboard/lead-magnets', icon: Sparkles },
  { label: 'AI Reports', href: '/dashboard/ai-reports', icon: Bot },
  { label: 'Proposals', href: '/dashboard/proposals', icon: FileText },
  { label: 'Email Marketing', href: '/dashboard/email-marketing', icon: Mail },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Handshake },
  { label: 'Advisor Tools', href: '/dashboard/advisor-tools', icon: Settings2 },
  { label: 'Properties', href: '/dashboard/properties', icon: Building2 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-950">
      <aside className="fixed inset-y-0 hidden w-80 overflow-y-auto border-r border-white/10 bg-slate-950 px-5 py-6 text-white xl:block">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-emerald-300 to-amber-200 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              A
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">AkarAI</h1>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-100/70">Co-Investor OS</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            AI-native deal intelligence for retirement relocation, visa readiness, property matching, and partner growth.
          </p>
        </div>

        <nav className="mt-6 grid gap-1.5">
          {nav.map(({ label, href, icon: Icon }, index) => (
            <a
              key={href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white ${index === 0 ? 'bg-white/10 text-white shadow-inner shadow-white/5' : ''}`}
              href={href}
            >
              <Icon className="h-4 w-4 text-cyan-200/80 transition group-hover:text-cyan-100" />
              <span className="flex-1">{label}</span>
              {index === 0 ? <ChevronRight className="h-4 w-4 text-emerald-200" /> : null}
            </a>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_32rem),linear-gradient(135deg,#f8fafc_0%,#ecfeff_42%,#fefce8_100%)] p-4 xl:ml-80 xl:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
