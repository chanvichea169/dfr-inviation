import { useEffect, useState } from "react";
import { getProvinces, getDistricts, getCommunes, getVillages } from "../api/locationApi";
import type { Province, District, Commune, Village } from "../interfaces/location";

export function useLocations() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Sequential, not parallel: the MEF API is rate limited, so hitting it
        // with 4 concurrent paginated streams triggers 429s. Populate each level
        // as it arrives so the form is usable before villages finish loading.
        const p = await getProvinces();
        if (cancelled) return;
        setProvinces(p);
        // Provinces are enough to render the form — stop blocking the UI now.
        // The rest stream in while the user works through step 1.
        setLoading(false);

        const d = await getDistricts();
        if (cancelled) return;
        setDistricts(d);

        const c = await getCommunes();
        if (cancelled) return;
        setCommunes(c);

        const v = await getVillages();
        if (cancelled) return;
        setVillages(v);

        console.log({ provinces: p.length, districts: d.length, communes: c.length, villages: v.length });
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to fetch location data:", err);
        setError(err?.message || "Failed to load locations");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    provinces,
    districts,
    communes,
    villages,
    loading,
    error,
  };
}
