import { useEffect, useState } from "react";
import { getProvinces, getDistricts, getCommunes, getVillages } from "../api/locationApi";
import type { Province, District, Commune, Village } from "../interfaces/location";

export function useLocations() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProvinces(),
      getDistricts(),
      getCommunes(),
      getVillages()
    ])
      .then(([p, d, c, v]) => {
    console.log({
      provinces: p.length,
      districts: d.length,
      communes: c.length,
      villages: v.length
    });

    setProvinces(p);
    setDistricts(d);
    setCommunes(c);
    setVillages(v);

  })
      .catch((error) => {
        console.error("Failed to fetch location data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    provinces,
    districts,
    communes,
    villages,
    loading,
  };
}