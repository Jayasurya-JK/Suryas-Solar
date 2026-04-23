export const locationsData = {
  cuddalore: {
    name: "Cuddalore",
    title: "Best Solar Company in Cuddalore | Surya's Solar",
    description: "Looking for the best solar panels in Cuddalore? Surya's Solar offers premium On-Grid and Hybrid solar systems with TNEB net-metering and PM Surya Ghar subsidy support.",
    heroTitle: "Expert Solar Installation in Cuddalore",
    heroSubtitle: "Save up to 90% on your TNEB bills with Tier-1 ALMM approved solar panels designed for Cuddalore's coastal climate.",
    localInsights: [
      "Specialized rust-proof mounting structures designed for the coastal salt air.",
      "Direct coordination with the Cuddalore TNEB office for fast net-metering.",
      "Highest subsidies processed through the PM Surya Ghar Muft Bijli Yojana."
    ],
    mapEmbed: "https://maps.google.com/maps?q=11.768513,79.733547&hl=en&z=12&output=embed", // Center on Cuddalore
    popularSystems: ["3kW On-Grid", "5kW Hybrid"]
  },
  puducherry: {
    name: "Puducherry",
    title: "Top Solar Panel Company in Puducherry (Pondicherry)",
    description: "Surya's Solar provides expert residential and commercial solar installations across Puducherry. Get a free site visit and ROI calculation today.",
    heroTitle: "Premium Solar Systems in Puducherry",
    heroSubtitle: "Harness the abundant sunshine in Pondicherry. We handle complete A-Z solar installations including PED (Electricity Department) approvals.",
    localInsights: [
      "Customized solutions for both residential villas and commercial establishments in Pondicherry.",
      "Expert liaisoning with the Puducherry Electricity Department for seamless grid integration.",
      "High-efficiency Bifacial panels to maximize output in limited roof spaces."
    ],
    mapEmbed: "https://maps.google.com/maps?q=11.9416,79.8083&hl=en&z=12&output=embed", // Center on Puducherry
    popularSystems: ["5kW On-Grid", "10kW Commercial"]
  },
  panruti: {
    name: "Panruti",
    title: "Reliable Solar Installation in Panruti | Surya's Solar",
    description: "Beat voltage fluctuations in Panruti with Surya's Solar Hybrid systems. We offer complete solar solutions with battery backup.",
    heroTitle: "Solar Power Solutions in Panruti",
    heroSubtitle: "Protect your home from power cuts and high TNEB bills with our robust Solar Hybrid & On-Grid systems.",
    localInsights: [
      "Advanced Hybrid Solar Inverters to combat local voltage fluctuations in Panruti.",
      "Durable solar panels perfect for agricultural and residential use.",
      "Local maintenance team ready for rapid response."
    ],
    mapEmbed: "https://maps.google.com/maps?q=11.7753,79.5547&hl=en&z=12&output=embed", // Center on Panruti
    popularSystems: ["3kW Hybrid", "5kW On-Grid"]
  },
  neyveli: {
    name: "Neyveli",
    title: "Solar Panel Installation in Neyveli Township & Surroundings",
    description: "Surya's Solar delivers high-quality rooftop solar plants in Neyveli. Reduce your electricity dependency today.",
    heroTitle: "Go Solar in Neyveli",
    heroSubtitle: "Professional solar EPC services for homes and businesses in and around Neyveli.",
    localInsights: [
      "Expert structural engineering for diverse roof types in the Neyveli region.",
      "End-to-end PM Surya Ghar subsidy documentation.",
      "High-generation Mono PERC and TOPCon technology."
    ],
    mapEmbed: "https://maps.google.com/maps?q=11.5976,79.4883&hl=en&z=12&output=embed", // Center on Neyveli
    popularSystems: ["5kW On-Grid", "3kW On-Grid"]
  }
};

export const getAllLocations = () => {
  return Object.keys(locationsData);
};

export const getLocationData = (slug) => {
  return locationsData[slug];
};
