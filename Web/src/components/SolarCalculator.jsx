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
 * - TARIFF: Average electricity rate (₹ per kWh) - adjust for your region
 * - ANNUAL_GEN_PER_KW: Solar generation per kW per year (kWh/kW/year) - adjust for sunlight
 * - COST_PER_WATT_INTERNAL: System installation cost (₹/Watt) - adjust for market rates
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ==================== CONSTANTS ====================
// These can be easily adjusted for different markets or assumptions

const BILLS_PER_YEAR = 6;                  // Bi-monthly billing cycle
const TARIFF = 7.8;                        // ₹ per kWh (blended rate)
const ANNUAL_GEN_PER_KW = 1400;            // kWh per kW per year (average solar generation)
const COST_PER_WATT_INTERNAL = 42.5;       // ₹/W system cost (used internally for ROI/payback)
const SYSTEM_LIFETIME_YEARS = 25;          // Expected system lifespan in years
const SOLAR_RESIDUAL_FACTOR = 0.05;        // 5% leftover bill after solar installation
const INPUT_MIN = 2000;                    // Minimum bi-monthly bill (₹2000 = ~2.5kW system)
const INPUT_MAX = 30000;                    // Maximum bi-monthly bill (₹)

export default function SolarCalculator({ showBreakdown = false }) {
  // ==================== STATE ====================
  const [biMonthlyBill, setBiMonthlyBill] = useState('5000');
  const [calculatedData, setCalculatedData] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // ==================== CALCULATION LOGIC ====================
  const calculateSavings = useCallback((inputBill) => {
    const bill = parseFloat(inputBill);

    // Validate input range
    if (isNaN(bill) || bill < 0 || bill > INPUT_MAX) {
      setValidationError(`Please enter a value between ₹${INPUT_MIN.toLocaleString('en-IN')} and ₹${INPUT_MAX.toLocaleString('en-IN')}`);
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
        setValidationError(`Minimum bill amount is ₹${INPUT_MIN.toLocaleString('en-IN')} (approx. 2.5 kW system). We specialize in 3 kW and above installations.`);
      }
      return;
    }

    // FORMULA 1: Annual electricity bill
    const annualBill = bill * BILLS_PER_YEAR;

    // FORMULA 2: Annual electricity consumption in kWh
    const annualKwh = annualBill / TARIFF;

    // FORMULA 3: Recommended solar system size (kW) - rounded to 1 decimal
    const recommendedKw = Math.round((annualKwh / ANNUAL_GEN_PER_KW) * 10) / 10;

    // FORMULA 4: System capacity in Watts (internal use only)
    const systemWatts_internal = Math.round(recommendedKw * 1000);

    // FORMULA 5: System cost (internal use only - NOT shown in UI)
    const systemCost_internal = systemWatts_internal * COST_PER_WATT_INTERNAL;

    // FORMULA 6: Annual savings (assume full offset for marketing)
    const annualSavings = annualBill;

    // FORMULA 7: Lifetime savings over system lifespan
    const lifetimeSavings = annualSavings * SYSTEM_LIFETIME_YEARS;

    // FORMULA 8: Payback period in years (internal calculation - rounded to 1 decimal)
    const paybackYears_internal = Math.round((systemCost_internal / annualSavings) * 10) / 10;

    // FORMULA 9: Return on Investment percentage per annum (internal - rounded to 1 decimal)
    const roiPercent_internal = Math.round(((annualSavings / systemCost_internal) * 100) * 10) / 10;

    // FORMULA 10: Solar bi-monthly bill (5% of original)
    const solarBimonthlyBill = Math.round(bill * SOLAR_RESIDUAL_FACTOR);

    setCalculatedData({
      annualBill,
      annualSavings,
      lifetimeSavings,
      recommendedKw,
      paybackYears_internal,
      roiPercent_internal,
      regularBill: bill,
      solarBimonthlyBill,
    });
    setIsCalculated(true);
  }, []);

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
    labels: ['Regular Electricity Bill', 'With Solar'],
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
        barThickness: 70,
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
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
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
          return `₹${value.toLocaleString('en-IN')}`;
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
          callback: function(value) {
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
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
            Solar Savings Calculator
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate your potential savings with precision
          </p>
        </div>

        {/* Input Section - Premium Design */}
        <div className="max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
            <label htmlFor="billInput" className="block text-sm sm:text-base font-semibold text-slate-900 mb-3">
              Your Bi-monthly Electricity Bill
            </label>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl sm:text-2xl font-semibold">
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
                        window.location.href = '/calc';
                      }
                    }
                  }}
                  placeholder="5000"
                  min="0"
                  max={INPUT_MAX}
                  className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 text-lg sm:text-xl font-semibold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none bg-slate-50 focus:bg-white text-slate-900"
                  aria-describedby="billHelp billError"
                  aria-invalid={validationError ? 'true' : 'false'}
                />
              </div>
              <button
                onClick={() => {
                  setHasUserInteracted(true);
                  calculateSavings(biMonthlyBill);
                  if (typeof window !== 'undefined' && window.location.pathname !== '/calc') {
                    window.location.href = '/calc';
                  }
                }}
                className="px-5 sm:px-6 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                Calculate
              </button>
            </div>
            {validationError && (
              <p id="billError" className="text-sm text-rose-600 mt-3 font-medium text-center" role="alert">
                {validationError}
              </p>
            )}
            {!validationError && (
              <p id="billHelp" className="text-xs sm:text-sm text-slate-500 mt-3 text-center">
                Enter amount between ₹{INPUT_MIN.toLocaleString('en-IN')} and ₹{INPUT_MAX.toLocaleString('en-IN')} • We specialize in 3 kW+ systems
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        {isCalculated && calculatedData && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Accessibility: Live region for screen readers */}
            <div 
              className="sr-only" 
              role="status" 
              aria-live="polite" 
              aria-atomic="true"
            >
              For ₹{calculatedData.regularBill.toLocaleString('en-IN')} bi-monthly bill, 
              estimated recommended system is {calculatedData.recommendedKw} kilowatt, 
              annual savings ₹{calculatedData.annualSavings.toLocaleString('en-IN')}, 
              estimated payback {calculatedData.paybackYears_internal} years, 
              return on investment {calculatedData.roiPercent_internal} percent per annum.
            </div>

            {/* Top Stats - Annual & Lifetime Savings - Premium Design */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-5 group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold">Annual Savings</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
                    ₹{calculatedData.annualSavings.toLocaleString('en-IN')}
                  </p>
                  <p className="text-slate-500 text-xs">Estimated yearly savings with solar</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-5 group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm font-semibold">Lifetime Savings</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
                    ₹{calculatedData.lifetimeSavings.toLocaleString('en-IN')}
                  </p>
                  <p className="text-slate-500 text-xs">Total savings over 25 years</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* LEFT CARD: System Details */}
              <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 border border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Your Solar System
                </h3>

                {/* Recommended System Size - Hero Stat */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-5 mb-3 border border-slate-200">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-1">Recommended Solar Capacity</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {calculatedData.recommendedKw}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-indigo-600">kW</p>
                  </div>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-3 sm:p-4 border border-violet-200">
                    <p className="text-xs text-violet-700 font-medium mb-1">Payback Period</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl sm:text-2xl font-black text-violet-900">{calculatedData.paybackYears_internal}</p>
                      <p className="text-xs font-semibold text-violet-700">years</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 sm:p-4 border border-amber-200">
                    <p className="text-xs text-amber-700 font-medium mb-1">Return on Investment</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl sm:text-2xl font-black text-amber-900">{calculatedData.roiPercent_internal}</p>
                      <p className="text-xs font-semibold text-amber-700">% p.a.</p>
                    </div>
                  </div>
                </div>

                {/* Solar Panel Image */}
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/images/solar-panel-illustration.png" 
                    alt="Rooftop solar panel installation"
                    className="w-full max-w-xs h-auto rounded-xl opacity-80"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* RIGHT CARD: Bill Comparison */}
              <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 border border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Bill Comparison (Bi-monthly)
                </h3>

                {/* Chart */}
                {chartData && (
                  <div className="mb-5">
                    <div className="h-56 sm:h-64">
                      <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                    </div>

                    {/* Accessibility: Offscreen chart summary */}
                    <div className="sr-only">
                      Chart showing bi-monthly bill comparison: 
                      Regular electricity bill is ₹{calculatedData.regularBill.toLocaleString('en-IN')}, 
                      with solar it becomes ₹{calculatedData.solarBimonthlyBill.toLocaleString('en-IN')}.
                    </div>
                  </div>
                )}

                {/* Comparison Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 sm:p-4 border border-slate-300">
                    <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-1.5">Regular Bill</p>
                    <p className="text-lg sm:text-xl font-black text-slate-900">
                      ₹{calculatedData.regularBill.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">bi-monthly</p>
                  </div>

                  <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 sm:p-4 border border-emerald-300 overflow-hidden">
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      95% OFF
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-700 font-semibold mb-1.5">With Solar</p>
                    <p className="text-lg sm:text-xl font-black text-emerald-900">
                      ₹{calculatedData.solarBimonthlyBill.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">bi-monthly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note - Moved before CTA */}
            <div className="mt-6 bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <p className="text-xs text-indigo-800 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <strong>Note:</strong> Calculations are based on current electricity tariff of ₹7.8/unit and average Tamil Nadu sunlight conditions. Actual system cost and detailed pricing will be provided during your free consultation based on your specific requirements.
                </span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center pt-5 sm:pt-6">
              <a
                href="/#booking"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Book Free Consultation Now!</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="text-slate-600 mt-3 text-xs sm:text-sm">
                Free site assessment • Expert consultation • Customized quote
              </p>
            </div>

            {/* How We Calculate Section - Only show on calc page */}
            {showBreakdown && (
              <div className="mt-8 sm:mt-10 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  How We Calculate Your Savings
                </h3>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center mt-0.5">1</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Your Current Electricity Usage</p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Bi-monthly bill: <span className="font-semibold text-slate-900">₹{calculatedData.regularBill.toLocaleString('en-IN')}</span>
                        <br />
                        Annual bill: <span className="font-semibold text-slate-900">₹{calculatedData.regularBill.toLocaleString('en-IN')} × 6 = ₹{calculatedData.annualBill.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center mt-0.5">2</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Energy Consumption Calculation</p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Annual usage: <span className="font-semibold text-slate-900">₹{calculatedData.annualBill.toLocaleString('en-IN')} ÷ ₹7.8/unit = {Math.round(calculatedData.annualBill / TARIFF).toLocaleString('en-IN')} units/year</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center mt-0.5">3</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Recommended Solar System</p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        System size: <span className="font-semibold text-slate-900">{calculatedData.recommendedKw} kW</span>
                        <br />
                        <span className="text-xs text-slate-500">Based on 1400 units generation per kW annually in Tamil Nadu</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm flex items-center justify-center mt-0.5">4</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Your Savings with Solar</p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Annual savings: <span className="font-semibold text-emerald-600">₹{calculatedData.annualSavings.toLocaleString('en-IN')}/year</span>
                        <br />
                        25-year savings: <span className="font-semibold text-emerald-600">₹{calculatedData.lifetimeSavings.toLocaleString('en-IN')}</span>
                        <br />
                        <span className="text-xs text-slate-500">Solar reduces your bill by 95% - You only pay ₹{calculatedData.solarBimonthlyBill.toLocaleString('en-IN')} bi-monthly!</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5 - Payback Period */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 text-violet-600 font-bold text-sm flex items-center justify-center mt-0.5">5</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Payback Period</p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        <span className="font-semibold text-violet-600">{calculatedData.paybackYears_internal} years</span> to recover your investment
                        <br />
                        <span className="text-xs text-slate-500">This is the time it takes for your electricity savings to equal your initial solar investment. After this period, you enjoy free electricity!</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 6 - ROI */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-600 font-bold text-sm flex items-center justify-center mt-0.5">6</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-sm mb-1">Return on Investment (ROI)</p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        <span className="font-semibold text-amber-600">{calculatedData.roiPercent_internal}% per year</span>
                        <br />
                        <span className="text-xs text-slate-500">Your annual return from going solar. Over 25 years, your total return is {Math.round(calculatedData.roiPercent_internal * 25)}%! Much better than traditional investments.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
