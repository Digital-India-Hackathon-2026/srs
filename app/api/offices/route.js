import { getOfficesByDistrict, TELANGANA_DISTRICTS } from "../../../lib/offices/index";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const pin = searchParams.get("pin");

  if (district) {
    const offices = getOfficesByDistrict(district);
    return Response.json({ district, offices, total: offices.length });
  }

  if (pin) {
    // Search all districts for this PIN
    for (const d of TELANGANA_DISTRICTS) {
      const offices = getOfficesByDistrict(d);
      const matches = offices.filter(o => o.pinCode === pin);
      if (matches.length > 0) {
        return Response.json({ district: d, offices: matches, total: matches.length, searchedByPin: true });
      }
    }
    // No exact match — find nearest district based on PIN prefix
    const prefix = pin.substring(0, 3);
    for (const d of TELANGANA_DISTRICTS) {
      const offices = getOfficesByDistrict(d);
      const nearby = offices.filter(o => o.pinCode?.startsWith(prefix));
      if (nearby.length > 0) {
        return Response.json({ district: d, offices: nearby, total: nearby.length, searchedByPin: true, approximate: true });
      }
    }
    return Response.json({ district: null, offices: [], total: 0, searchedByPin: true });
  }

  return Response.json({ districts: TELANGANA_DISTRICTS });
}
