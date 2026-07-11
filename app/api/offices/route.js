import { getOfficesByDistrict, TELANGANA_DISTRICTS } from "../../../lib/offices/index";
import { lookupPin, haversine } from "../../../lib/location/pincodeDirectory";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const pin = searchParams.get("pin");
  const service = searchParams.get("service");

  // PIN-first search
  if (pin) {
    // Validate format
    if (!/^\d{6}$/.test(pin)) {
      return Response.json({ error: "Please enter a valid 6-digit PIN code.", offices: [], total: 0 });
    }

    const pinInfo = lookupPin(pin);

    if (!pinInfo) {
      return Response.json({
        error: "This PIN code is not in the Hyderabad metro directory. PIN-code search currently supports Hyderabad metropolitan areas.",
        offices: [],
        total: 0,
      });
    }

    const { locality, mandal, district: pinDistrict, lat, lng } = pinInfo;

    // Get offices from PIN's district AND neighboring Hyderabad metro districts
    const metroDistricts = ["Hyderabad", "Medchal-Malkajgiri", "Rangareddy"];
    let allOffices = [];
    for (const d of metroDistricts) {
      const dOffices = getOfficesByDistrict(d);
      allOffices.push(...dOffices);
    }
    // Also include the PIN's own district if not in metro list
    if (!metroDistricts.includes(pinDistrict)) {
      allOffices.push(...getOfficesByDistrict(pinDistrict));
    }

    // Calculate distance from PIN location
    let results = allOffices.map(o => ({
      ...o,
      distance: (o.lat && o.lng) ? haversine(lat, lng, o.lat, o.lng) : null,
    }));

    // Filter by service type if provided
    if (service) {
      const serviceTypeMap = {
        "income-certificate": ["MeeSeva", "Revenue Office"],
        "caste-certificate": ["MeeSeva", "Revenue Office"],
        "residence-certificate": ["MeeSeva", "Revenue Office"],
        "birth-certificate": ["MeeSeva", "GHMC", "Municipality"],
        "death-certificate": ["MeeSeva", "GHMC", "Municipality"],
        "passport": ["Passport Seva Kendra", "POPSK"],
        "driving-licence": ["RTO"],
        "aadhaar-update": ["Aadhaar"],
        "voter-id": ["MeeSeva"],
        "ration-card": ["MeeSeva", "Civil Supplies"],
      };
      const preferredTypes = serviceTypeMap[service] || [];
      if (preferredTypes.length > 0) {
        results = results.filter(o => preferredTypes.some(t => o.type.includes(t)));
      }
    }

    // Filter to within 10 km and sort nearest first
    results = results.filter(o => o.distance != null && o.distance < 10);
    results.sort((a, b) => (a.distance || 999) - (b.distance || 999));

    // Mismatch check
    const mismatch = district && district !== pinDistrict;

    return Response.json({
      pinInfo: { locality, mandal, district: pinDistrict },
      mismatch: mismatch ? `PIN ${pin} belongs to ${pinDistrict}. District updated automatically.` : null,
      offices: results,
      total: results.length,
    });
  }

  // District-only search
  if (district) {
    let offices = getOfficesByDistrict(district);

    if (service) {
      const serviceTypeMap = {
        "income-certificate": ["MeeSeva", "Revenue Office"],
        "driving-licence": ["RTO"],
        "aadhaar-update": ["Aadhaar"],
        "passport": ["Passport Seva Kendra"],
        "birth-certificate": ["MeeSeva", "GHMC", "Municipality"],
      };
      const preferredTypes = serviceTypeMap[service] || [];
      if (preferredTypes.length > 0) {
        offices.sort((a, b) => {
          const aPref = preferredTypes.some(t => a.type?.includes(t)) ? 0 : 1;
          const bPref = preferredTypes.some(t => b.type?.includes(t)) ? 0 : 1;
          return aPref - bPref;
        });
      }
    }

    return Response.json({ district, offices, total: offices.length });
  }

  return Response.json({ districts: TELANGANA_DISTRICTS });
}
