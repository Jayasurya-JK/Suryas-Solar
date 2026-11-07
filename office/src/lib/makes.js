// What the "Make" column says for the partner chosen on the quote.
//
// Tata Power Solar supplies the whole electrical set, so a TPS quote reads TPS on every one of those rows.
// Any other partner makes the solar module itself, while the structure, earthing kit and DC cable follow the
// usual makes we buy. Everything else (ACDB, DCDB, AC cable, earthing cable, UPVC) keeps whatever it had.
//
// These are defaults written when a partner is picked. Each row stays editable afterwards, so a customer
// asking for a different cable or structure is one tap away.

export const TPS_BRAND = "Tata Power Solar";

const isTpsItem = (item) => /panel|module|inverter|acdb|dcdb|distribution|earthing kit|lightning arrester|mms|mounting structure/i.test(item);
const isModule = (item) => /panel|module/i.test(item);
const isStructure = (item) => /mms|mounting structure/i.test(item);
const isEarthingKit = (item) => /earthing kit|lightning arrester/i.test(item);
const isDcCable = (item) => /^dc cable/i.test(item);

export const USUAL_MAKES = { structure: "JSW Galvanization", earthing: "Pure copper rod", dcCable: "Polycab" };

export function makeFor(item = "", brand = "") {
  if (!brand) return null;
  if (brand === TPS_BRAND) return isTpsItem(item) ? "TPS" : null;
  if (isModule(item)) return brand;
  if (isStructure(item)) return USUAL_MAKES.structure;
  if (isEarthingKit(item)) return USUAL_MAKES.earthing;
  if (isDcCable(item)) return USUAL_MAKES.dcCable;
  return null;
}

// Returns the bill of materials with its makes set for this partner.
export function applyBrandMakes(bom = [], brand = "") {
  if (!brand) return bom;
  return bom.map((row) => {
    const make = makeFor(row.item, brand);
    return make ? { ...row, make } : row;
  });
}

// The system block's own brand fields follow the same rule.
export function applyBrandToSystem(system = {}, brand = "") {
  if (!brand) return system;
  if (brand === TPS_BRAND) return { ...system, brand, panel_brand: "TPS", inverter_brand: "TPS" };
  return { ...system, brand, panel_brand: brand };
}
