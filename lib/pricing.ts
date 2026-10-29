export interface PricingInput {
  hours: number;
  groupSize: number;
  selectedAddons: string[];
}

export const ADDON_PRICING: Record<string, number> = {
  'National Museum Ticket': 10,
  'Unity Park Entry': 20,
  'Traditional Coffee Ceremony': 5,
  'Cultural Lunch / Dinner': 15,
  'Local Market / Merkato Walk': 0, // Free activity walk
};

export function calculateTourPrice({ hours, groupSize, selectedAddons }: PricingInput) {
  // 1. Calculate Base Logistics Fee (Time + Group Size)
  let baseFee = 35; // Default 3-4 hrs Solo

  if (hours <= 4) {
    if (groupSize === 1) baseFee = 35;
    else if (groupSize <= 3) baseFee = 45;
    else baseFee = 65; // Group / Van
  } else if (hours <= 6) {
    if (groupSize === 1) baseFee = 55;
    else if (groupSize <= 3) baseFee = 70;
    else baseFee = 95;
  } else {
    // 7+ Hours
    if (groupSize === 1) baseFee = 80;
    else if (groupSize <= 3) baseFee = 100;
    else baseFee = 130;
  }

  // 2. Calculate Per-Person Add-ons
  let addonsFeePerPerson = 0;
  selectedAddons.forEach((addonKey) => {
    if (ADDON_PRICING[addonKey] !== undefined) {
      addonsFeePerPerson += ADDON_PRICING[addonKey];
    }
  });

  const totalAddonsFee = addonsFeePerPerson * groupSize;
  const totalPrice = baseFee + totalAddonsFee;

  return {
    baseFee,
    totalAddonsFee,
    totalPrice,
  };
}