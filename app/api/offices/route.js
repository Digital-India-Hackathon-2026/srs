import { getOfficesByDistrict, TELANGANA_DISTRICTS } from "../../../lib/offices/index";
import { lookupPin, haversine } from "../../../lib/location/pincodeDirectory";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const pin = searchParams.get("pin");
  const service = searchParams.get("service");

  // PIN-first search
  if (pin) {
    const pinInfo = lookupPin(pin);

    if (!pinInfo) {
      return Response.json({ error: "Invalid PIN code", offices: [], total: 0 });
    }

    const { locality, mandal, district: pinDistrict, lat, lng } = pinInfo;
    const offices = getOfficesByDistrict(pinDistrict);

    // Calculate distance and sort
    let results = offices.map(o => ({
      ...o,
      distance: (o.lat && o.lng) ? haversine(lat, lng, o.lat, o.lng) : null,
    }));

    // Filter by service if provided
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
        results.sort((a, b) => {
          const aPref = preferredTypes.some(t => a.type.includes(t)) ? 0 : 1;
          const bPref = preferredTypes.some(t => b.type.includes(t)) ? 0 : 1;
          if (aPref !== bPref) return aPref - bPref;
          return (a.distance || 999) - (b.distance || 999);
        });
      } else {
        results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      }
    } else {
      results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    // Group: exact PIN → nearby → others
    const exact = results.filter(o => o.pinCode === pin);
    const nearby = results.filter(o => o.pinCode !== pin && (o.distance || 999) < 10);
    const others = results.filter(o => o.pinCode !== pin && (o.distance || 999) >= 10);

    // Mismatch check
    const mismatch = district && district !== pinDistrict;

    return Response.json({
      pinInfo: { locality, mandal, district: pinDistrict },
      mismatch: mismatch ? `PIN ${pin} belongs to ${pinDistrict}, not ${district}.` : null,
      exact,
      nearby,
      others,
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
