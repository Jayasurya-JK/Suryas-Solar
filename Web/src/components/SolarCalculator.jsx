/*
 * SOLAR SAVINGS CALCULATOR - Production-Ready Component
 * 
 * OVERVIEW:
 * User inputs their bi-monthly electricity bill, and the component calculates:
 * - Recommended solar system size (kW)
 * - Annual and lifetime savings
 * - Payback period (years)
 * - Return on Investment (% p.a.)
 * - Side-by-side bill comparison chart
 * 
 * TUNABLE CONSTANTS (edit these to adjust calculations):
 * - SLABS_UPTO_500 / SLABS_ABOVE_500: TNEB domestic bi-monthly slab rates - update when tariffs change
 * - ANNUAL_GEN_PER_KW: Solar generation per kW per year (kWh/kW/year) - adjust for sunlight
 * - SYSTEM_PRICE_POINTS: market-average installed prices by kW - update with the blog price list
 * - SOLAR_RESIDUAL_FACTOR: Remaining bill after solar (0.05 = 5% leftover) - adjust for grid dependency
 * - BILLS_PER_YEAR: Number of billing cycles per year (6 for bi-monthly)
 * - SYSTEM_LIFETIME_YEARS: Expected system lifespan for lifetime savings calculation
 * 
 * INSTALLATION:
 * npm install react-chartjs-2 chart.js
 * 
 * USAGE:
 * import SolarCalculator from '@/components/SolarCalculator';
 * <SolarCalculator />
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SectionHeading from './SectionHeading'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ==================== HELPER FUNCTIONS ====================

/**
 * Format numbers with Indian numbering system (lakhs, crores) using regular commas
 * Replaces toLocaleString('en-IN') to avoid thin spaces that cause display issues
 */
const formatIndianNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const numStr = Math.round(num).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);

  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
};

// ==================== CONSTANTS ====================
// These can be easily adjusted for different markets or assumptions

// Last reviewed: Oct 2026. Keep in sync with the blog price/slab posts and the suryas-business-facts skill.
const BILLS_PER_YEAR = 6;                  // Bi-monthly billing cycle
const FIXED_CHARGE = 100;                  // ₹ approx. fixed charge per bi-monthly bill (excluded from units)
const ANNUAL_GEN_PER_KW = 1500;            // kWh per kW per year in Tamil Nadu (about 4.1 units/day)
const SYSTEM_LIFETIME_YEARS = 25;          // Expected system lifespan in years
const SOLAR_RESIDUAL_FACTOR = 0.05;        // Leftover bill after solar (seasonal shortfall, fixed charges)
const SOLAR_RESIDUAL_MIN = 150;            // ₹ minimum bi-monthly bill with solar
const INPUT_MIN = 2000;                    // Minimum bi-monthly bill (₹2000 = ~2kW system)
const INPUT_MAX = 30000;                    // Maximum bi-monthly bill (₹)

// TNEB domestic bi-monthly slabs (approx., same figures as the blog's slab guide).
// [units at end of slab, ₹ per unit in slab]
const SLABS_UPTO_500 = [[200, 0], [400, 4.5], [500, 6]];
const SLABS_ABOVE_500 = [[100, 0], [400, 4.5], [500, 6], [600, 8], [800, 9], [1000, 10], [Infinity, 11]];

// Market-average installed price of an on-grid DCR system (₹), midpoints of the blog price list.
const SYSTEM_PRICE_POINTS = [[1, 75000], [2, 137500], [3, 195000], [5, 315000], [10, 575000]];
const PRICE_PER_KW_ABOVE_10 = 57500;

/** Convert a bi-monthly bill (₹) into bi-monthly units using the slab tables. */
const billToUnits = (bill) => {
  const energyCharge = Math.max(0, bill - FIXED_CHARGE);
  const walk = (slabs) => {
    let prevUnits = 0;
    let spent = 0;
    for (const [upto, rate] of slabs) {
      const slabCost = rate === 0 ? 0 : (upto - prevUnits) * rate;
      if (rate > 0 && spent + slabCost >= energyCharge) return prevUnits + (energyCharge - spent) / rate;
      spent += slabCost;
      prevUnits = upto;
    }
    return prevUnits;
  };
  const low = walk(SLABS_UPTO_500);
  // Up to ₹1,500 of energy charges fits inside the 500-unit regime; above that, the above-500 table applies.
  return energyCharge <= 1500 ? low : Math.max(500, walk(SLABS_ABOVE_500));
};

/** Installed price (₹) for a system size, interpolated from market-average price points. */
const systemPrice = (kw) => {
  if (kw >= 10) return 575000 + (kw - 10) * PRICE_PER_KW_ABOVE_10;
  for (let i = 1; i < SYSTEM_PRICE_POINTS.length; i++) {
    const [k1, p1] = SYSTEM_PRICE_POINTS[i - 1];
    const [k2, p2] = SYSTEM_PRICE_POINTS[i];
    if (kw <= k2) return p1 + ((Math.max(kw, k1) - k1) / (k2 - k1)) * (p2 - p1);
  }
  return SYSTEM_PRICE_POINTS[SYSTEM_PRICE_POINTS.length - 1][1];
};

/** PM Surya Ghar central subsidy + Tamil Nadu G.O. 102 top-up for an eligible TN home. */
const subsidyFor = (kw) => {
  const central = Math.min(kw, 2) * 30000 + Math.max(0, Math.min(kw, 3) - 2) * 18000;
  const tnTopUp = kw >= 3 ? 22000 : kw >= 2 ? 10000 : kw >= 1 ? 5000 : 0;
  return Math.round(central + tnTopUp);
};

export default function SolarCalculator({ showBreakdown = false, headingLevel = 'h2' }) {
  const router = useRouter();
  // ==================== STATE ====================
  const [biMonthlyBill, setBiMonthlyBill] = useState('5000');
  const [calculatedData, setCalculatedData] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const HeadingTag = headingLevel;

  // ... (rest of the state and logic)

  // ==================== CALCULATION LOGIC ====================
  const calculateSavings = useCallback((inputBill) => {
    const bill = parseFloat(inputBill);

    // Validate input range
    if (isNaN(bill) || bill < 0 || bill > INPUT_MAX) {
      setValidationError(`Please enter a value between ₹${formatIndianNumber(INPUT_MIN)} and ₹${formatIndianNumber(INPUT_MAX)}`);
      setCalculatedData(null);
      setIsCalculated(false);
      return;
    }

    setValidationError('');

    // Handle zero or below minimum bill case - show zero values
    if (bill === 0 || bill < INPUT_MIN) {
      setCalculatedData({
        annualBill: 0,
        annualSavings: 0,
        lifetimeSavings: 0,
        recommendedKw: 0,
        paybackYears_internal: 0,
        roiPercent_internal: 0,
        regularBill: 0,
        solarBimonthlyBill: 0,
      });
      setIsCalculated(true);
      if (bill > 0 && bill < INPUT_MIN) {
        setValidationError(`Minimum bill amount is ₹${formatIndianNumber(INPUT_MIN)} (about a 2 kW system). We specialize in 2 kW and above installations.`);
      }
      return;
    }

    // FORMULA 1: Annual electricity bill
    const annualBill = bill * BILLS_PER_YEAR;

    // FORMULA 2: Annual electricity consumption in units, using TNEB slab rates
    const bimonthlyUnits = billToUnits(bill);
    const annualKwh = bimonthlyUnits * BILLS_PER_YEAR;

    // FORMULA 3: Recommended solar system size (kW) - rounded to 1 decimal
    const recommendedKw = Math.max(1, Math.round((annualKwh / ANNUAL_GEN_PER_KW) * 10) / 10);

    // FORMULA 4-5: Market-average system price, subsidy and net cost (internal - NOT shown in UI)
    const systemCost_internal = systemPrice(recommendedKw);
    const subsidy_internal = subsidyFor(recommendedKw);
    const netCost_internal = systemCost_internal - subsidy_internal;

    // FORMULA 6: Solar bi-monthly bill (small leftover) and annual savings
    const solarBimonthlyBill = Math.min(bill, Math.max(SOLAR_RESIDUAL_MIN, Math.round(bill * SOLAR_RESIDUAL_FACTOR)));
    const annualSavings = (bill - solarBimonthlyBill) * BILLS_PER_YEAR;
    const billReductionPercent = Math.round(((bill - solarBimonthlyBill) / bill) * 100);

    // FORMULA 7: Lifetime savings over system lifespan, after paying for the system
    const lifetimeSavings = annualSavings * SYSTEM_LIFETIME_YEARS - netCost_internal;

    // FORMULA 8: Payback period in years after subsidy (rounded to 1 decimal)
    const paybackYears_internal = Math.round((netCost_internal / annualSavings) * 10) / 10;

    // FORMULA 9: Return on Investment percentage per annum (internal - rounded to 1 decimal)
    const roiPercent_internal = Math.round(((annualSavings / netCost_internal) * 100) * 10) / 10;

    setCalculatedData({
      annualBill,
      annualKwh: Math.round(annualKwh),
      annualSavings,
      lifetimeSavings,
      recommendedKw,
      paybackYears_internal,
      roiPercent_internal,
      regularBill: bill,
      solarBimonthlyBill,
      billReductionPercent,
    });
    setIsCalculated(true);
  }, []);

  // ==================== INITIALIZATION FROM URL ====================
  useEffect(() => {
    if (router.isReady && router.query.bill) {
      const billParam = router.query.bill;
      if (!isNaN(parseFloat(billParam))) {
        setBiMonthlyBill(billParam);
        calculateSavings(billParam);
      }
    }
  }, [router.isReady, router.query.bill, calculateSavings]);

  // ==================== INPUT HANDLER WITH DEBOUNCE ====================
  useEffect(() => {
    // Only skip calculation if truly empty (not just "0")
    if (biMonthlyBill === '' || biMonthlyBill === null || biMonthlyBill === undefined) {
      setCalculatedData(null);
      setIsCalculated(false);
      setValidationError('');
      return;
    }

    const timer = setTimeout(() => {
      calculateSavings(biMonthlyBill);
      // Auto-calculation does NOT redirect - only explicit actions do
    }, 300); // 300ms debounce for live updates

    return () => clearTimeout(timer);
  }, [biMonthlyBill, calculateSavings]);

  // ==================== CHART CONFIGURATION ====================
  const chartData = calculatedData ? {
    labels: ['Regular Bill', 'With Solar'],
    datasets: [
      {
        label: 'Bi-monthly Cost (₹)',
        data: [calculatedData.regularBill, calculatedData.solarBimonthlyBill],
        backgroundColor: [
          'rgba(99, 102, 241, 0.12)', // Subtle indigo for regular bill
          'rgba(16, 185, 129, 0.12)',  // Subtle emerald for solar bill
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)', // Indigo
          'rgba(5, 150, 105, 1)',  // Emerald
        ],
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 50,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40, // Add padding to prevent label clipping
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 16,
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 14,
          weight: '500',
        },
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `₹${formatIndianNumber(context.parsed.y)}`;
          },
        },
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        offset: 8,
        formatter: (value) => {
          // Always show value, even if it's 0
          if (value === 0) return '₹0';
          return `₹${formatIndianNumber(value)}`;
        },
        font: {
          weight: '700',
          size: 13,
          family: 'system-ui, -apple-system, sans-serif',
        },
        color: (context) => {
          return context.dataIndex === 0 ? '#4f46e5' : '#059669';
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 6,
          callback: function (value) {
            if (value >= 1000) {
              return '₹' + (value / 1000).toFixed(0) + 'k';
            }
            return '₹' + value;
          },
          font: {
            size: 12,
            weight: '500',
          },
          color: '#64748b',
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '600',
          },
          color: '#475569',
        },
        border: {
          display: false,
        },
      },
    },
  };

  // Register datalabels plugin
  useEffect(() => {
    ChartJS.register(ChartDataLabels);
    return () => {
      ChartJS.unregister(ChartDataLabels);
    };
  }, []);

  // ==================== RENDER ====================
  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-14 md:py-20">
        {/* Header Section */}
        <SectionHeading as={HeadingTag} className="mb-6 sm:mb-8" eyebrow="Free calculator" title={<>Solar Savings Calculator <span className="text-primary">Tamil Nadu</span></>} subtitle="Enter your EB bill to see the system size, savings and payback." />

        {/* Input Section - Compact Design */}
        <div className="max-w-xl mx-auto mb-5 sm:mb-8">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <label htmlFor="billInput" className="block text-sm sm:text-base font-semibold text-slate-900 mb-2 sm:mb-3">
              Your Bi-monthly Electricity Bill
            </label>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-slate-500 text-lg sm:text-2xl font-semibold">
                  ₹
                </span>
                <input
                  id="billInput"
                  type="number"
                  value={biMonthlyBill}
                  onChange={(e) => {
                    setBiMonthlyBill(e.target.value);
                    setHasUserInteracted(true);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setHasUserInteracted(true);
                      calculateSavings(biMonthlyBill);
                      if (typeof window !== 'undefined' && window.location.pathname !== '/calc') {
                        window.location.href = `/calc?bill=${biMonthlyBill}`;
                      }
                    }
                  }}
                  placeholder="5000"
                  min="0"
                  max={INPUT_MAX}
                  className="w-full pl-8 sm:pl-12 pr-3 sm:pr-6 py-2.5 sm:py-4 text-base sm:text-xl font-semibold border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none bg-slate-50 focus:bg-white text-slate-900"
                  aria-describedby="billHelp billError"
                  aria-invalid={validationError ? 'true' : 'false'}
                />
              </div>
              <button
                onClick={() => {
                  setHasUserInteracted(true);
                  calculateSavings(biMonthlyBill);
                  if (typeof window !== 'undefined' && window.location.pathname !== '/calc') {
                    window.location.href = `/calc?bill=${biMonthlyBill}`;
                  }
                }}
                className="px-4 sm:px-6 py-2.5 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                Calculate
              </button>
            </div>
            {validationError && (
              <p id="billError" className="text-xs sm:text-sm text-rose-600 mt-2 sm:mt-3 font-medium text-center" role="alert">
                {validationError}
              </p>
            )}
            {!validationError && (
              <p id="billHelp" className="text-xs sm:text-sm text-slate-500 mt-2 sm:mt-3 text-center">
                Enter amount between ₹{formatIndianNumber(INPUT_MIN)} and ₹{formatIndianNumber(INPUT_MAX)} • We specialize in 2 kW+ systems
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {isCalculated && calculatedData && (
          <div className="space-y-3 sm:space-y-6 animate-fadeIn">
            {/* Accessibility: Live region for screen readers */}
            <div
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              For ₹{formatIndianNumber(calculatedData.regularBill)} bi-monthly bill,
              estimated recommended system is {calculatedData.recommendedKw} kilowatt,
              annual savings ₹{formatIndianNumber(calculatedData.annualSavings)},
              estimated payback {calculatedData.paybackYears_internal} years,
              return on investment {calculatedData.roiPercent_internal} percent per annum.
            </div>

            <p className="text-center text-slate-600 font-medium text-xs sm:text-base">
              Calculation for your <span className="text-slate-900 font-bold">₹{formatIndianNumber(calculatedData.regularBill)}</span> bi-monthly electricity bill
            </p>

            {/* Top Stats - Annual & Lifetime Savings - Compact Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-5 group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold">Annual Savings</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mb-0.5 sm:mb-1">
                    ₹{formatIndianNumber(calculatedData.annualSavings)}
                  </p>
                  <p className="text-slate-500 text-xs">Estimated yearly savings</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-5 group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold">Lifetime Savings</p>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mb-0.5 sm:mb-1">
                    ₹{formatIndianNumber(calculatedData.lifetimeSavings)}
                  </p>
                  <p className="text-slate-500 text-xs">Over 25 years, after system cost</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
              {/* LEFT CARD: System Details */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-5 border border-slate-200">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Your Solar System
                </h3>

                {/* Recommended System Size - Hero Stat */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-5 mb-2 sm:mb-3 border border-slate-200">
                  <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-indigo-200 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 opacity-20"></div>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-0.5 sm:mb-1">Recommended Solar Capacity</p>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {calculatedData.recommendedKw}
                    </p>
                    <p className="text-base sm:text-xl font-bold text-indigo-600">kW</p>
                  </div>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-violet-200">
                    <p className="text-xs text-violet-700 font-medium mb-0.5 sm:mb-1">Payback Period</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-lg sm:text-2xl font-black text-violet-900">{calculatedData.paybackYears_internal}</p>
                      <p className="text-xs font-semibold text-violet-700">years</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-amber-200">
                    <p className="text-xs text-amber-700 font-medium mb-0.5 sm:mb-1">Return on Investment</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-lg sm:text-2xl font-black text-amber-900">{calculatedData.roiPercent_internal}</p>
                      <p className="text-xs font-semibold text-amber-700">% p.a.</p>
                    </div>
                  </div>
                </div>

                {/* Solar Panel Image */}
                {/* Solar Panel Image - Removed as file is missing */}
              </div>

              {/* RIGHT CARD: Bill Comparison */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-5 border border-slate-200">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Bill Comparison
                </h3>

                {/* Chart */}
                {chartData && (
                  <div className="mb-4 sm:mb-5">
                    <div className="h-48 sm:h-64">
                      <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                    </div>

                    {/* Accessibility: Offscreen chart summary */}
                    <div className="sr-only">
                      Chart showing bi-monthly bill comparison:
                      Regular electricity bill is ₹{formatIndianNumber(calculatedData.regularBill)},
                      with solar it becomes ₹{formatIndianNumber(calculatedData.solarBimonthlyBill)}.
                    </div>
                  </div>
                )}

                {/* Comparison Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-slate-300">
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-1">Regular Bill</p>
                    <p className="text-base sm:text-xl font-black text-slate-900">
                      ₹{formatIndianNumber(calculatedData.regularBill)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">every 2 months</p>
                  </div>

                  <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-emerald-300 overflow-hidden">
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {calculatedData.billReductionPercent}% OFF
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-700 font-semibold mb-1">With Solar</p>
                    <p className="text-base sm:text-xl font-black text-emerald-900">
                      ₹{formatIndianNumber(calculatedData.solarBimonthlyBill)}
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">every 2 months</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note - Moved before CTA */}
            <div className="mt-4 sm:mt-6 bg-indigo-50 rounded-lg p-2.5 sm:p-3 border border-indigo-200">
              <p className="text-xs sm:text-sm text-indigo-800 flex items-start gap-2 leading-relaxed">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>Note:</strong> Estimates use TNEB domestic slab rates, about 1,500 units per kW per year of Tamil Nadu sunshine, market-average system prices (Oct 2026) and the up to ₹1 lakh subsidy for eligible Tamil Nadu homes (Puducherry: up to ₹78,000). Your exact price comes in a written quote after a free site visit.
                </span>
              </p>
            </div>

            {/* How We Calculate Section - Only show on calc page */}
            {showBreakdown && (
              <div className="mt-6 sm:mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">How we worked it out</h3>
                  <p className="mt-0.5 text-sm text-slate-500">Six simple steps from your bill to your savings.</p>
                </div>
                <ol className="divide-y divide-slate-100">
                  {[
                    { label: 'Your current bill', value: `₹${formatIndianNumber(calculatedData.annualBill)}/year`, note: `₹${formatIndianNumber(calculatedData.regularBill)} every two months x 6`, tone: 'text-slate-900' },
                    { label: 'Your yearly usage', value: `${formatIndianNumber(calculatedData.annualKwh)} units`, note: 'Worked back from your bill using TNEB slab rates (free units, then ₹4.50 to ₹11 per unit).', tone: 'text-slate-900' },
                    { label: 'Solar size for you', value: `${calculatedData.recommendedKw} kW`, note: 'Each kW makes about 1,500 units a year in Tamil Nadu.', tone: 'text-primary' },
                    { label: 'Yearly savings', value: `₹${formatIndianNumber(calculatedData.annualSavings)}`, note: `Your bill drops about ${calculatedData.billReductionPercent}%, to around ₹${formatIndianNumber(calculatedData.solarBimonthlyBill)} every two months.`, tone: 'text-emerald-600' },
                    { label: 'Payback', value: `${calculatedData.paybackYears_internal} years`, note: 'Time for the savings to repay the system cost after subsidy. After that, the savings are yours.', tone: 'text-violet-600' },
                    { label: '25-year savings', value: `₹${formatIndianNumber(calculatedData.lifetimeSavings)}`, note: `After paying for the system. That is about ${calculatedData.roiPercent_internal}% return a year.`, tone: 'text-emerald-600' },
                  ].map((row, i) => (
                    <li key={row.label} className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-4">
                      <span className="w-7 h-7 shrink-0 rounded-full bg-primary-50 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[15px] sm:text-base font-semibold text-slate-900">{row.label}</span>
                          <span className={`text-lg sm:text-xl font-black whitespace-nowrap ${row.tone}`}>{row.value}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">{row.note}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
