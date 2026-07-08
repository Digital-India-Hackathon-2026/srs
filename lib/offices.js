export const districts = [
  "Hyderabad",
  "Medchal-Malkajgiri",
  "Rangareddy",
  "Warangal",
  "Karimnagar",
  "Nalgonda",
  "Nizamabad",
  "Khammam"
];

export const officesByDistrict = {
  "Hyderabad": [
    { name: "MeeSeva Centre, Himayatnagar", type: "MeeSeva", address: "Himayatnagar, Hyderabad", phone: "1800-599-4788" },
    { name: "GHMC Zonal Office, Khairatabad", type: "GHMC", address: "Khairatabad, Hyderabad", phone: "040-23225237" },
    { name: "Aadhaar Seva Kendra, Punjagutta", type: "Aadhaar", address: "Punjagutta, Hyderabad", phone: "1947" },
    { name: "Mandal Revenue Office, Secunderabad", type: "Revenue Office", address: "Secunderabad, Hyderabad", phone: "040-27840844" },
    { name: "RTO Hyderabad Central", type: "RTO", address: "Nampally, Hyderabad", phone: "040-23223000" }
  ],
  "Medchal-Malkajgiri": [
    { name: "MeeSeva Centre, Kompally", type: "MeeSeva", address: "Kompally, Medchal", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Medchal", type: "Revenue Office", address: "Medchal, Medchal-Malkajgiri", phone: "040-27260202" },
    { name: "MeeSeva Centre, Uppal", type: "MeeSeva", address: "Uppal, Malkajgiri", phone: "1800-599-4788" },
    { name: "Aadhaar Seva Kendra, Ghatkesar", type: "Aadhaar", address: "Ghatkesar, Medchal-Malkajgiri", phone: "1947" }
  ],
  "Rangareddy": [
    { name: "MeeSeva Centre, LB Nagar", type: "MeeSeva", address: "LB Nagar, Rangareddy", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Rajendranagar", type: "Revenue Office", address: "Rajendranagar, Rangareddy", phone: "040-24010501" },
    { name: "MeeSeva Centre, Kukatpally", type: "MeeSeva", address: "Kukatpally, Rangareddy", phone: "1800-599-4788" },
    { name: "RTO Rangareddy", type: "RTO", address: "Meerpet, Rangareddy", phone: "040-24452626" }
  ],
  "Warangal": [
    { name: "MeeSeva Centre, Warangal Urban", type: "MeeSeva", address: "Hanamkonda, Warangal", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Warangal", type: "Revenue Office", address: "Warangal Urban, Warangal", phone: "0870-2578900" },
    { name: "Aadhaar Seva Kendra, Hanamkonda", type: "Aadhaar", address: "Hanamkonda, Warangal", phone: "1947" },
    { name: "RTO Warangal", type: "RTO", address: "Warangal, Telangana", phone: "0870-2440204" }
  ],
  "Karimnagar": [
    { name: "MeeSeva Centre, Karimnagar", type: "MeeSeva", address: "Karimnagar Town, Karimnagar", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Karimnagar", type: "Revenue Office", address: "Karimnagar, Telangana", phone: "0878-2245566" },
    { name: "RTO Karimnagar", type: "RTO", address: "Karimnagar, Telangana", phone: "0878-2242323" }
  ],
  "Nalgonda": [
    { name: "MeeSeva Centre, Nalgonda", type: "MeeSeva", address: "Nalgonda Town, Nalgonda", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Nalgonda", type: "Revenue Office", address: "Nalgonda, Telangana", phone: "08682-245566" },
    { name: "RTO Nalgonda", type: "RTO", address: "Nalgonda, Telangana", phone: "08682-243434" }
  ],
  "Nizamabad": [
    { name: "MeeSeva Centre, Nizamabad", type: "MeeSeva", address: "Nizamabad Town, Nizamabad", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Nizamabad", type: "Revenue Office", address: "Nizamabad, Telangana", phone: "08462-225566" },
    { name: "RTO Nizamabad", type: "RTO", address: "Nizamabad, Telangana", phone: "08462-224848" }
  ],
  "Khammam": [
    { name: "MeeSeva Centre, Khammam", type: "MeeSeva", address: "Khammam Town, Khammam", phone: "1800-599-4788" },
    { name: "Mandal Revenue Office, Khammam", type: "Revenue Office", address: "Khammam, Telangana", phone: "08742-225566" },
    { name: "RTO Khammam", type: "RTO", address: "Khammam, Telangana", phone: "08742-224545" }
  ]
};

export function findOffices(district) {
  if (!district || !officesByDistrict[district]) {
    return officesByDistrict["Hyderabad"];
  }
  return officesByDistrict[district];
}
