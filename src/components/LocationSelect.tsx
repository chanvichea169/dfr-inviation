"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Props } from "../interfaces/location";

export default function LocationForm({
  provinces,
  districts,
  communes,
  villages,
}: Props) {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [commune, setCommune] = useState("");
  const [village, setVillage] = useState("");

  const districtList = useMemo(() => {
    return districts.filter(
      (d) => String(d.province_code).trim() === String(province).trim()
    );
  }, [province, districts]);

  const communeList = useMemo(() => {
    return communes.filter(
      (c) => Number(c.district_code) === Number(district)
    );
  }, [district, communes]);


  // Filter villages by commune
  const villageList = useMemo(() => {
    return villages.filter(
      (v) => Number(v.commune_code) === Number(commune)
    );
  }, [commune, villages]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const selectedProvince = provinces.find(
      (p) => String(p.province_code) === String(province)
    );

    const selectedDistrict = districts.find(
      (d) => String(d.district_code) === String(district)
    );

    const selectedCommune = communes.find(
      (c) => String(c.commune_code) === String(commune)
    );

    const selectedVillage = villages.find(
      (v) => String(v.village_code) === String(village)
    );


    console.log({
      selectedProvince,
      selectedDistrict,
      selectedCommune,
      selectedVillage,
    });


    alert(
      `បានជ្រើសរើស៖ 
      ${selectedProvince?.province_kh} /
      ${selectedDistrict?.district_kh} /
      ${selectedCommune?.commune_kh} /
      ${selectedVillage?.village_kh}`
    );
  };


  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 font-khmer">
      <div className="rounded-3xl bg-white border shadow-xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          ទម្រង់ជ្រើសរើសទីតាំង
        </h2>


        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


            {/* Province */}
            <div>
              <label className="block mb-2 font-semibold">
                ខេត្ត/ក្រុង
              </label>

              <select
                className="w-full border rounded-lg p-3"
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                  setCommune("");
                  setVillage("");
                }}
              >
                <option value="">
                  ជ្រើសរើសខេត្ត
                </option>

                {provinces.map((p) => (
                  <option
                    key={p.province_code}
                    value={String(p.province_code)}
                  >
                    {p.province_kh}
                  </option>
                ))}
              </select>
            </div>



            {/* District */}
            <div>
              <label className="block mb-2 font-semibold">
                ស្រុក/ខណ្ឌ
              </label>

              <select
                disabled={!province}
                className="w-full border rounded-lg p-3"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setCommune("");
                  setVillage("");
                }}
              >
                <option value="">
                  ជ្រើសរើសស្រុក
                </option>

                {districtList.map((d) => (
                  <option
                    key={d.district_code}
                    value={String(d.district_code)}
                  >
                    {d.district_kh}
                  </option>
                ))}
              </select>
            </div>



            {/* Commune */}
            <div>
              <label className="block mb-2 font-semibold">
                ឃុំ/សង្កាត់
              </label>

              <select
                disabled={!district}
                className="w-full border rounded-lg p-3"
                value={commune}
                onChange={(e) => {
                  setCommune(e.target.value);
                  setVillage("");
                }}
              >
                <option value="">
                  ជ្រើសរើសឃុំ
                </option>

                {communeList.map((c) => (
                  <option
                    key={c.commune_code}
                    value={String(c.commune_code)}
                  >
                    {c.commune_kh}
                  </option>
                ))}
              </select>
            </div>



            {/* Village */}
            <div>
              <label className="block mb-2 font-semibold">
                ភូមិ
              </label>

              <select
                disabled={!commune}
                className="w-full border rounded-lg p-3"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              >
                <option value="">
                  ជ្រើសរើសភូមិ
                </option>

                {villageList.map((v) => (
                  <option
                    key={v.village_code}
                    value={String(v.village_code)}
                  >
                    {v.village_kh}
                  </option>
                ))}

              </select>
            </div>


          </div>


          <button
            type="submit"
            disabled={!village}
            className="mt-8 px-8 py-3 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-50"
          >
            បញ្ជូនព័ត៌មាន
          </button>

        </form>

      </div>
    </div>
  );
}