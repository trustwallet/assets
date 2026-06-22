const nav = [
  ['Dashboard', '/dashboard'], ['Pipeline', '/dashboard/pipeline'], ['Retirees', '/dashboard/retirees'], ['Matches', '/dashboard/matches'], ['Email Templates', '/dashboard/email-templates'], ['Developers', '/dashboard/developers'], ['Projects', '/dashboard/projects'], ['Properties', '/dashboard/properties'], ['Media', '/dashboard/media']
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen"><aside className="fixed hidden h-full w-72 bg-brand-900 p-6 text-white md:block"><h1 className="text-2xl font-bold">TRLA</h1><p className="mt-2 text-sm text-brand-100">Thailand retirement living advisor CRM and inventory</p><nav className="mt-8 grid gap-2">{nav.map(([label, href]) => <a key={href} className="rounded-lg px-3 py-2 hover:bg-white/10" href={href}>{label}</a>)}</nav></aside><main className="p-4 md:ml-72 md:p-8">{children}</main></div>;
}
