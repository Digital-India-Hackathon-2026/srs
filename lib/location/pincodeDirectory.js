/**
 * Telangana PIN Code Directory
 * Maps PIN codes to locality, mandal, district, and coordinates.
 * Used for PIN-first office search.
 */

export const PIN_DIRECTORY = {
  "500001": { locality: "Nampally", mandal: "Nampally", district: "Hyderabad", lat: 17.385, lng: 78.473 },
  "500003": { locality: "Secunderabad", mandal: "Secunderabad", district: "Hyderabad", lat: 17.440, lng: 78.498 },
  "500004": { locality: "Khairatabad", mandal: "Khairatabad", district: "Hyderabad", lat: 17.407, lng: 78.459 },
  "500008": { locality: "Golconda", mandal: "Golconda", district: "Hyderabad", lat: 17.383, lng: 78.401 },
  "500014": { locality: "Kompally", mandal: "Quthbullapur", district: "Medchal-Malkajgiri", lat: 17.534, lng: 78.488 },
  "500020": { locality: "Ashok Nagar", mandal: "Musheerabad", district: "Hyderabad", lat: 17.382, lng: 78.482 },
  "500028": { locality: "Mehdipatnam", mandal: "Rajendranagar", district: "Rangareddy", lat: 17.395, lng: 78.442 },
  "500029": { locality: "Himayatnagar", mandal: "Himayatnagar", district: "Hyderabad", lat: 17.398, lng: 78.486 },
  "500030": { locality: "Rajendranagar", mandal: "Rajendranagar", district: "Rangareddy", lat: 17.326, lng: 78.443 },
  "500039": { locality: "Uppal", mandal: "Uppal", district: "Medchal-Malkajgiri", lat: 17.403, lng: 78.559 },
  "500060": { locality: "Dilsukhnagar", mandal: "LB Nagar", district: "Rangareddy", lat: 17.369, lng: 78.525 },
  "500074": { locality: "LB Nagar", mandal: "LB Nagar", district: "Rangareddy", lat: 17.349, lng: 78.548 },
  "500082": { locality: "Punjagutta", mandal: "Ameerpet", district: "Hyderabad", lat: 17.428, lng: 78.449 },
  "500092": { locality: "Boduppal", mandal: "Medipally", district: "Medchal-Malkajgiri", lat: 17.413, lng: 78.578 },
  "500097": { locality: "Meerpet", mandal: "Meerpet", district: "Rangareddy", lat: 17.326, lng: 78.529 },
  "501301": { locality: "Ghatkesar", mandal: "Ghatkesar", district: "Medchal-Malkajgiri", lat: 17.450, lng: 78.680 },
  "501401": { locality: "Medchal", mandal: "Medchal", district: "Medchal-Malkajgiri", lat: 17.630, lng: 78.483 },
  "503001": { locality: "Nizamabad Town", mandal: "Nizamabad Urban", district: "Nizamabad", lat: 18.673, lng: 78.094 },
  "504001": { locality: "Adilabad Town", mandal: "Adilabad", district: "Adilabad", lat: 19.664, lng: 78.532 },
  "505001": { locality: "Karimnagar Town", mandal: "Karimnagar", district: "Karimnagar", lat: 18.439, lng: 79.129 },
  "506001": { locality: "Hanamkonda", mandal: "Hanamkonda", district: "Warangal", lat: 17.999, lng: 79.580 },
  "506002": { locality: "Warangal Fort", mandal: "Warangal", district: "Warangal", lat: 17.978, lng: 79.585 },
  "507001": { locality: "Khammam Town", mandal: "Khammam", district: "Khammam", lat: 17.247, lng: 80.151 },
  "508001": { locality: "Nalgonda Town", mandal: "Nalgonda", district: "Nalgonda", lat: 17.058, lng: 79.267 },
  "509001": { locality: "Mahabubnagar Town", mandal: "Mahabubnagar", district: "Mahabubnagar", lat: 16.737, lng: 77.985 },
  "502001": { locality: "Sangareddy Town", mandal: "Sangareddy", district: "Sangareddy", lat: 17.615, lng: 78.087 },
};

/**
 * Lookup a PIN code.
 * @param {string} pin — 6-digit PIN code
 * @returns {{ locality, mandal, district, lat, lng } | null}
 */
export function lookupPin(pin) {
  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) return null;
  return PIN_DIRECTORY[pin] || null;
}

/**
 * Get all PIN codes for a district.
 */
export function getPinsForDistrict(district) {
  return Object.entries(PIN_DIRECTORY)
    .filter(([, v]) => v.district === district)
    .map(([pin, v]) => ({ pin, ...v }));
}

/**
 * Haversine distance in km.
 */
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
