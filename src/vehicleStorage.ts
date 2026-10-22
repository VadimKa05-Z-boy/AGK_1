
import { vehicles as initialVehicles, type Vehicle } from "./vehicles";

const STORAGE_KEY = "fleethub.vehicles.v1";

export function loadVehicles(): Vehicle[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed as Vehicle[];
      }
    }
  } catch {
    console.warn("Не удалось прочитать сохранённые автомобили FleetHub.");
  }

  return initialVehicles;
}

export function saveVehicles(items: Vehicle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("fleethub-vehicles-updated"));
}

export function createVehicleId(): string {
  return `car-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
