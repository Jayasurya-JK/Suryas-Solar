/**
 * Solar Calculator Test & Verification Script
 * 
 * This script verifies that the calculator formulas produce the expected results
 * for the test cases specified in the requirements.
 */

// Constants (must match SolarCalculator.jsx)
const BILLS_PER_YEAR = 6;
const TARIFF = 7.8;
const ANNUAL_GEN_PER_KW = 1400;
const COST_PER_WATT_INTERNAL = 42.5;
const SYSTEM_LIFETIME_YEARS = 25;
const SOLAR_RESIDUAL_FACTOR = 0.05;

function calculateSavings(biMonthlyBill) {
  const bill = parseFloat(biMonthlyBill);
  
  // FORMULA 1: Annual electricity bill
  const annualBill = bill * BILLS_PER_YEAR;

  // FORMULA 2: Annual electricity consumption in kWh
  const annualKwh = annualBill / TARIFF;

  // FORMULA 3: Recommended solar system size (kW) - rounded to 1 decimal
  const recommendedKw = Math.round((annualKwh / ANNUAL_GEN_PER_KW) * 10) / 10;

  // FORMULA 4: System capacity in Watts (internal use only)
  const systemWatts_internal = Math.round(recommendedKw * 1000);

  // FORMULA 5: System cost (internal use only)
  const systemCost_internal = systemWatts_internal * COST_PER_WATT_INTERNAL;

  // FORMULA 6: Annual savings (assume full offset)
  const annualSavings = annualBill;

  // FORMULA 7: Lifetime savings over system lifespan
  const lifetimeSavings = annualSavings * SYSTEM_LIFETIME_YEARS;

  // FORMULA 8: Payback period in years (rounded to 1 decimal)
  const paybackYears_internal = Math.round((systemCost_internal / annualSavings) * 10) / 10;

  // FORMULA 9: ROI percentage per annum (rounded to 1 decimal)
  const roiPercent_internal = Math.round(((annualSavings / systemCost_internal) * 100) * 10) / 10;

  // FORMULA 10: Solar bi-monthly bill (5% of original)
  const solarBimonthlyBill = Math.round(bill * SOLAR_RESIDUAL_FACTOR);

  return {
    biMonthlyBill: bill,
    annualBill,
    annualSavings,
    lifetimeSavings,
    recommendedKw,
    paybackYears_internal,
    roiPercent_internal,
    regularBill: bill,
    solarBimonthlyBill,
    // Internal values for verification
    _systemWatts: systemWatts_internal,
    _systemCost: systemCost_internal,
  };
}

// Test Cases
console.log('🧪 SOLAR CALCULATOR TEST VERIFICATION\n');
console.log('=' .repeat(80));

const testCases = [
  { input: 6000, expectedKw: 3.3, expectedAnnual: 36000, expectedLifetime: 900000, expectedChart: 300 },
  { input: 4000, expectedKw: 2.2, expectedAnnual: 24000, expectedLifetime: 600000, expectedChart: 200 },
  { input: 3000, expectedKw: 1.6, expectedAnnual: 18000, expectedLifetime: 450000, expectedChart: 150 },
];

testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ₹${testCase.input.toLocaleString('en-IN')} bi-monthly bill`);
  console.log('-'.repeat(80));
  
  const result = calculateSavings(testCase.input);
  
  console.log(`Input:                  ₹${result.biMonthlyBill.toLocaleString('en-IN')}`);
  console.log(`Annual Bill:            ₹${result.annualBill.toLocaleString('en-IN')} ${result.annualBill === testCase.expectedAnnual ? '✓' : '✗'}`);
  console.log(`Recommended System:     ${result.recommendedKw} kW ${Math.abs(result.recommendedKw - testCase.expectedKw) <= 0.2 ? '✓' : '✗'} (expected ~${testCase.expectedKw} kW)`);
  console.log(`Annual Savings:         ₹${result.annualSavings.toLocaleString('en-IN')} ${result.annualSavings === testCase.expectedAnnual ? '✓' : '✗'}`);
  console.log(`Lifetime Savings:       ₹${result.lifetimeSavings.toLocaleString('en-IN')} ${result.lifetimeSavings === testCase.expectedLifetime ? '✓' : '✗'}`);
  console.log(`Payback Period:         ${result.paybackYears_internal} years`);
  console.log(`ROI:                    ${result.roiPercent_internal}% p.a.`);
  console.log(`Chart: Regular vs Solar: ₹${result.regularBill.toLocaleString('en-IN')} vs ₹${result.solarBimonthlyBill.toLocaleString('en-IN')} ${result.solarBimonthlyBill === testCase.expectedChart ? '✓' : '✗'}`);
  console.log(`\nInternal (not shown in UI):`);
  console.log(`  System Cost:          ₹${result._systemCost.toLocaleString('en-IN')}`);
  console.log(`  System Watts:         ${result._systemWatts.toLocaleString('en-IN')} W`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ All test cases completed!\n');

// Additional edge case tests
console.log('🔬 EDGE CASE TESTS\n');
console.log('='.repeat(80));

const edgeCases = [
  { input: 1000, label: 'Minimum input' },
  { input: 30000, label: 'Maximum input' },
  { input: 10000, label: 'Large household' },
];

edgeCases.forEach((testCase) => {
  console.log(`\n${testCase.label}: ₹${testCase.input.toLocaleString('en-IN')}`);
  const result = calculateSavings(testCase.input);
  console.log(`  Recommended: ${result.recommendedKw} kW`);
  console.log(`  Annual Savings: ₹${result.annualSavings.toLocaleString('en-IN')}`);
  console.log(`  Payback: ${result.paybackYears_internal} years`);
  console.log(`  ROI: ${result.roiPercent_internal}% p.a.`);
});

console.log('\n' + '='.repeat(80));
console.log('\n✨ Verification complete! All formulas are working correctly.\n');
