# Solar Savings Calculator

## Overview
Interactive solar savings calculator that shows real-time calculations based on bi-monthly electricity bills.

## Files Created
- `src/components/SolarCalculator.jsx` - Main calculator component
- Integrated into `src/pages/index.jsx` (appears after Partners section)

## Dependencies
- `react-chartjs-2` ✅ Installed
- `chart.js` ✅ Installed

## Configuration Constants
Located at the top of `SolarCalculator.jsx`:

```javascript
const BILLS_PER_YEAR = 6                // Bi-monthly billing (6 bills per year)
const TARIFF = 8                        // ₹8 per kWh (electricity rate)
const ANNUAL_GEN_PER_KW = 1400         // kWh generated per kW per year
const COST_PER_WATT = 60               // ₹60 per Watt installation cost
const SYSTEM_LIFETIME_YEARS = 25       // Warranty period
const SOLAR_RESIDUAL_FACTOR = 0.05     // 5% residual bill with solar
const INPUT_MIN = 2500                 // Minimum bi-monthly bill
const INPUT_MAX = 30000                // Maximum bi-monthly bill
```

## Calculation Formulas

1. **Annual Bill** = Bi-monthly Bill × 6
2. **Annual kWh** = Annual Bill ÷ Tariff
3. **Recommended System Size (kW)** = Annual kWh ÷ 1400
4. **System Cost** = (Recommended kW × 1000) × ₹60 per Watt
5. **Annual Savings** = Annual Bill (assumes full offset)
6. **Lifetime Savings** = Annual Savings × 25 years
7. **Payback Years** = System Cost ÷ Annual Savings
8. **ROI %** = (Annual Savings ÷ System Cost) × 100
9. **Solar Bi-monthly Bill** = Current Bill × 5% (residual)

## Sample Calculations

### Input: ₹4,000 bi-monthly
- Annual Bill: ₹24,000
- Recommended System: 2.1 kW
- System Cost: ₹1,26,000
- Annual Savings: ₹24,000
- Lifetime Savings: ₹6,00,000
- Payback: 5.3 years
- ROI: 19% p.a.
- New Bi-monthly Bill: ₹200

### Input: ₹6,000 bi-monthly
- Annual Bill: ₹36,000
- Recommended System: 3.2 kW
- System Cost: ₹1,92,000
- Annual Savings: ₹36,000
- Lifetime Savings: ₹9,00,000
- Payback: 5.3 years
- ROI: 18.8% p.a.
- New Bi-monthly Bill: ₹300

## Features

✅ Real-time calculations as you type
✅ Input validation (₹2,500 - ₹30,000)
✅ Visual bar chart comparison (Regular vs Solar bill)
✅ Responsive design (mobile-first)
✅ Accessible (ARIA labels, screen reader support)
✅ "Book consultation" button scrolls to booking form
✅ Professional gradient UI with Tailwind CSS

## Customization

### To adjust electricity tariff:
Change `TARIFF = 8` to your desired rate per kWh

### To adjust installation cost:
Change `COST_PER_WATT = 60` to market rate

### To adjust solar generation capacity:
Change `ANNUAL_GEN_PER_KW = 1400` based on your region's average

### To adjust residual bill after solar:
Change `SOLAR_RESIDUAL_FACTOR = 0.05` (5% = 95% savings)

## Missing Asset
The component references `/images/solar-panel-3d.png` which needs to be added to the `public/images/` directory. Until added, the space will be reserved but image won't display.

## Usage
The calculator is automatically included on the homepage after the Partners section. No additional configuration needed.

## Testing Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000` and scroll to the calculator section.

## Accessibility
- Input has proper labels and descriptions
- Results announced via `aria-live` regions
- Chart has descriptive `aria-label`
- Screen reader summary of all calculations
- Keyboard navigable

## Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Works with JavaScript enabled (required for calculations)
