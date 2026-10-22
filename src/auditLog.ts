
const STORAGE_KEY = "fleethub.audit.v1";

export type AuditEntry = {
  id: string;
  date: string;
  vehicleId: string;
  vehicleName: string;
  action: "created" | "updated";
  field: string;
  oldValue: string;
  newValue: string;
};

export function readAuditLog(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function addAuditEntries(entries: AuditEntry[]): void {
  if (entries.length === 0) return;

  const current = readAuditLog();
  const updated = [...entries, ...current].slice(0, 2000);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("fleethub-audit-updated"));
}

export function createAuditEntry(
  vehicleId: string,
  vehicleName: string,
  action: AuditEntry["action"],
  field: string,
  oldValue: string,
  newValue: string,
): AuditEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    vehicleId,
    vehicleName,
    action,
    field,
    oldValue,
    newValue,
  };
}
