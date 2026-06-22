export type PortalRole = 'ADMIN' | 'ADVISOR' | 'DEVELOPER' | 'CLIENT';
const permissions: Record<PortalRole, string[]> = {
  ADMIN: ['*'],
  ADVISOR: ['crm:read','crm:write','property:read','ai:use','report:read','document:read','document:write'],
  DEVELOPER: ['developer:write','property:read'],
  CLIENT: ['portal:read','portal:write','ai:use','document:read','document:write']
};
export function can(role: PortalRole, permission: string) { return permissions[role]?.includes('*') || permissions[role]?.includes(permission); }
export function requireRole(role: PortalRole, permission: string) { if (!can(role, permission)) throw new Error(`Role ${role} cannot ${permission}`); }
