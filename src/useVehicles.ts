
import { useCallback, useEffect, useState } from "react";
import type { Vehicle } from "./vehicles";
import { loadVehicles, saveVehicles } from "./vehicleStorage";

export function useVehicles() {
  const [items, setItems] = useState<Vehicle[]>(loadVehicles);

  useEffect(() => {
    const refresh = () => setItems(loadVehicles());

    window.addEventListener("fleethub-vehicles-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("fleethub-vehicles-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const updateVehicles = useCallback((next: Vehicle[]) => {
    saveVehicles(next);
    setItems(next);
  }, []);

  return { vehicles: items, updateVehicles };
}
