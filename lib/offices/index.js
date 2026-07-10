/**
 * Telangana Office Database — Index
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads office data lazily per district.
 * Add new districts by creating a JSON file in lib/offices/data/
 */

import { readFileSync } from "fs";
import { join } from "path";

export const TELANGANA_DISTRICTS = [
  "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad",
  "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal",
  "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad",
  "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak",
  "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
  "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
  "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
  "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri",
];

const cache = new Map();

export function getOfficesByDistrict(district) {
  if (cache.has(district)) return cache.get(district);

  const slug = district.toLowerCase().replace(/[\s]+/g, "-").replace(/[^a-z0-9-]/g, "");
  try {
    const filePath = join(process.cwd(), "lib", "offices", "data", `${slug}.json`);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    cache.set(district, data);
    return data;
  } catch {
    return [];
  }
}

export function searchByPin(pin) {
  // Search all loaded districts for matching PIN
  for (const district of TELANGANA_DISTRICTS) {
    const offices = getOfficesByDistrict(district);
    const matches = offices.filter(o => o.pinCode === pin);
    if (matches.length > 0) return { district, offices: matches };
  }
  return { district: null, offices: [] };
}

/**
 * Calculate approximate distance between two lat/lng points (Haversine formula)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
