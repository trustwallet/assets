export function conversionRate(conversions: number, leads: number) { return leads ? Math.round((conversions / leads) * 1000) / 10 : 0; }
export function roas(revenue: number, spend: number) { return spend ? Math.round((revenue / spend) * 100) / 100 : 0; }
export function lifetimeValue(closedRevenue: number, closedClients: number) { return closedClients ? Math.round(closedRevenue / closedClients) : 0; }
