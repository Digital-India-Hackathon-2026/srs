/**
 * fieldMapper(extractedFields, formSchema)
 * ─────────────────────────────────────────────────────────────────────────────
 * OCR Layer 3: Maps extracted fields to the target service form schema.
 *
 * Takes the unified extracted fields from all uploaded documents and maps
 * them to the specific government service application form fields.
 *
 * Input:  Merged extracted fields + service form schema
 * Output: { mappedFields, unmappedFields, completionPercentage, draft }
 *
 * Currently returns mock mapped data.
 */

// Field name mapping — connects OCR-extracted field names to form schema field IDs
const FIELD_ALIASES = {
  // Aadhaar extractions → form fields
  full_name: ["applicant_name", "applicant_full_name"],
  date_of_birth: ["date_of_birth", "dob"],
  aadhaar_number: ["aadhaar_number", "aadhaar"],
  gender: ["gender"],
  address: ["present_address_line1", "address_line1"],
  pin_code: ["present_pin", "pin_code"],
  state: ["present_state", "state"],
  district: ["present_district", "district"],
  city: ["present_city", "city"],

  // PAN extractions → form fields
  pan_number: ["pan_number"],
  father_name: ["father_name", "father_husband_name"],

  // General
  mobile_number: ["mobile_number"],
  email: ["email"],
};

/**
 * @param {Record<string, string>} extractedFields — merged fields from all documents
 * @param {object} formSchema — service form schema (from lib/formSchemas/)
 * @returns {{
 *   success: boolean,
 *   mappedFields: Record<string, string>,
 *   unmappedFields: string[],
 *   missingRequired: string[],
 *   completionPercentage: number,
 *   draft: Array<{ id: string, label: string, value: string, source: string, confidence: number }>
 * }}
 */
export function mapFieldsToSchema(extractedFields, formSchema) {
  if (!formSchema || !formSchema.fields) {
    return {
      success: false,
      mappedFields: {},
      unmappedFields: Object.keys(extractedFields),
      missingRequired: [],
      completionPercentage: 0,
      draft: [],
    };
  }

  const mappedFields = {};
  const draft = [];
  const usedExtractedKeys = new Set();

  // For each form field, try to find a matching extracted value
  for (const formField of formSchema.fields) {
    let matchedValue = null;
    let matchSource = "not_found";

    // Direct ID match
    if (extractedFields[formField.id]) {
      matchedValue = extractedFields[formField.id];
      matchSource = "direct";
      usedExtractedKeys.add(formField.id);
    }

    // Alias match
    if (!matchedValue) {
      for (const [extractedKey, aliases] of Object.entries(FIELD_ALIASES)) {
        if (aliases.includes(formField.id) && extractedFields[extractedKey]) {
          matchedValue = extractedFields[extractedKey];
          matchSource = `alias:${extractedKey}`;
          usedExtractedKeys.add(extractedKey);
          break;
        }
      }
    }

    if (matchedValue) {
      mappedFields[formField.id] = matchedValue;
    }

    draft.push({
      id: formField.id,
      label: formField.label,
      value: matchedValue || "",
      source: matchedValue ? matchSource : "manual_required",
      confidence: matchedValue ? 0.85 : 0,
      required: formField.required,
      step: formField.step,
    });
  }

  // Calculate completion
  const totalRequired = formSchema.fields.filter((f) => f.required).length;
  const filledRequired = formSchema.fields.filter((f) => f.required && mappedFields[f.id]).length;
  const completionPercentage = totalRequired > 0 ? Math.round((filledRequired / totalRequired) * 100) : 0;

  // Find unmapped extracted fields (OCR found data that doesn't map to any form field)
  const unmappedFields = Object.keys(extractedFields).filter((k) => !usedExtractedKeys.has(k));

  // Find missing required fields
  const missingRequired = formSchema.fields
    .filter((f) => f.required && !mappedFields[f.id])
    .map((f) => f.label);

  return {
    success: true,
    mappedFields,
    unmappedFields,
    missingRequired,
    completionPercentage,
    draft,
  };
}

/**
 * Generate a printable/copy-ready draft from the mapped fields.
 *
 * @param {object} mappingResult — output of mapFieldsToSchema()
 * @param {object} formSchema
 * @returns {{
 *   serviceName: string,
 *   officialPortal: string,
 *   steps: Array<{ stepName: string, fields: Array<{ label: string, value: string }> }>,
 *   completionPercentage: number,
 *   readyToSubmit: boolean
 * }}
 */
export function generateDraft(mappingResult, formSchema) {
  if (!mappingResult.success || !formSchema) {
    return {
      serviceName: "",
      officialPortal: "",
      steps: [],
      completionPercentage: 0,
      readyToSubmit: false,
    };
  }

  // Group draft fields by step
  const stepGroups = {};
  for (const field of mappingResult.draft) {
    const stepIndex = field.step ?? 0;
    if (!stepGroups[stepIndex]) stepGroups[stepIndex] = [];
    stepGroups[stepIndex].push(field);
  }

  const steps = formSchema.steps.map((stepName, index) => ({
    stepName,
    fields: (stepGroups[index] || []).map((f) => ({
      label: f.label,
      value: f.value || "—",
      filled: !!f.value,
      required: f.required,
    })),
  }));

  return {
    serviceName: formSchema.serviceName,
    officialPortal: formSchema.officialPortal,
    steps,
    completionPercentage: mappingResult.completionPercentage,
    readyToSubmit: mappingResult.missingRequired.length === 0,
  };
}
