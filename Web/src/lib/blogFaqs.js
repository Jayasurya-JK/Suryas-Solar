export function getFaqsForPost(post) {
  const frontmatterFaqs = Array.isArray(post?.faqs)
    ? post.faqs.filter((faq) => faq && faq.question && faq.answer)
    : []

  if (frontmatterFaqs.length > 0) {
    return frontmatterFaqs
  }

  // Default FAQs for the cost breakdown post
  const costFaqs = [
    {
      question: "How much does a 3kW solar system cost in Cuddalore with subsidy?",
      answer: "A 3kW system typically costs between ₹1.6L - ₹1.9L. After the ₹78,000 PM Surya Ghar subsidy, your net cost is approximately ₹1L - ₹1.2L."
    },
    {
      question: "How much roof space do I need for a 3kW system?",
      answer: "You need approximately 300 sq. ft. of shadow-free roof area."
    },
    {
      question: "Will solar panels work during a power cut?",
      answer: "On-grid systems (most common) shut down during power cuts for safety. If you need backup, you should opt for a Hybrid Solar System with batteries."
    },
    {
      question: "What is the warranty on solar panels?",
      answer: "Most Tier-1 panels come with a 25-year performance warranty. Inverters typically have 5-10 years warranty."
    }
  ];

  // FAQs for the Best Brands post
  const brandsFaqs = [
    {
      question: "Which solar panel brand is No.1 in Tamil Nadu?",
      answer: "Tata Power Solar and Waaree Energies are widely considered the top brands in Tamil Nadu due to their extensive service network and proven performance."
    },
    {
      question: "Which brand is best for Puducherry climate?",
      answer: "For Puducherry's humid coastal climate, we recommend brands like Panasonic or Adani TOPCon which offer superior corrosion resistance and anti-PID technology."
    },
    {
      question: "Mono PERC vs TOPCon: which is better?",
      answer: "TOPCon is the newer, more efficient technology with better ROI over 25 years. However, Mono PERC is still an excellent, cost-effective choice for most homes."
    },
    {
      question: "Is Loom Solar good for home use?",
      answer: "Yes, Loom Solar is a fantastic budget-friendly option for residential rooftops, offering high-efficiency Mono PERC panels at a competitive price."
    },
    {
      question: "What warranty should I look for?",
      answer: "Look for a 25-year performance warranty and at least a 10-12 year product warranty. All brands we install (Tata, Waaree, Adani) meet these standards."
    }
  ];



  // FAQs for the Inverter post
  const inverterFaqs = [
    {
      question: "Which inverter is best for Tamil Nadu?",
      answer: "For most homes in Tamil Nadu with stable grid power, an On-Grid inverter (Solis, Growatt, Waaree) is the best choice for maximum savings and ROI."
    },
    {
      question: "Which inverter is best for Pondicherry?",
      answer: "Due to occasional power cuts and coastal humidity, we recommend Hybrid inverters (SolaX, Deye) that offer battery backup and robust protection."
    },
    {
      question: "What inverter do I need for a 3kW system?",
      answer: "For a 3kW solar system, you need a 3kW or 3.3kW inverter. It's important to match the inverter capacity with your panel capacity."
    },
    {
      question: "Can I add battery later?",
      answer: "Only if you install a Hybrid inverter initially. Standard On-Grid inverters cannot connect to batteries directly."
    },
    {
      question: "Do inverters work during power cuts?",
      answer: "On-Grid inverters shut down during power cuts for safety. Hybrid inverters continue to run and power your home using the battery backup."
    }
  ];

  // FAQs for the Structure post
  const structureFaqs = [
    {
      question: "Which structure lasts longest?",
      answer: "Hot-Dip Galvanized (HDGI) and RCC structures have the longest lifespan (20+ years) due to their superior corrosion resistance."
    },
    {
      question: "Is Hot-Dip necessary?",
      answer: "In coastal areas like Cuddalore and Puducherry, Hot-Dip is absolutely necessary to prevent rust. In dry inland areas, standard GI may suffice."
    },
    {
      question: "Can solar damage my RCC roof?",
      answer: "No, if installed correctly with concrete pedestals (RCC structure), there is no drilling into the roof, so there is zero risk of leakage or damage."
    },
    {
      question: "Should I choose elevated structures?",
      answer: "Elevated structures are great if you want to use the roof space for other purposes, but they cost significantly more than standard low-height structures."
    },
    {
      question: "What is wind load?",
      answer: "Wind load is the force of wind on the panels. In coastal TN, structures must be designed to withstand wind speeds of 150-180 km/h for safety."
    }
  ];

  // FAQs for the Net Metering post
  const netMeteringFaqs = [
    {
      question: "What is net-metering?",
      answer: "Net-metering is a billing mechanism that allows you to export excess solar power to the grid and get a credit on your electricity bill."
    },
    {
      question: "Can I get zero bill?",
      answer: "Yes, if your solar system generates enough power to cover your entire monthly consumption (Import - Export <= 0), your energy bill can be zero."
    },
    {
      question: "How long approval takes?",
      answer: "In Tamil Nadu, the process typically takes 2-4 weeks. In Puducherry, it can be slightly faster, around 1-3 weeks."
    },
    {
      question: "Can hybrid inverter be used?",
      answer: "Yes, hybrid inverters are fully compatible with net-metering and are highly recommended for areas with power cuts."
    },
    {
      question: "Is net-metering available in Puducherry?",
      answer: "Yes, the Puducherry Electricity Department (PED) offers net-metering for residential consumers."
    },
    {
      question: "What if I export more units?",
      answer: "If you export more than you import, the excess units are typically carried forward as a credit to your next month's bill."
    }
  ];

  // FAQs for the ROI Calculator post
  const roiFaqs = [
    {
      question: "What is the payback period for 3kW solar?",
      answer: "With the ₹78,000 subsidy and current TNEB rates, the payback period is approximately 3.2 to 3.6 years."
    },
    {
      question: "How much will I save in 25 years?",
      answer: "A 3kW system can generate lifetime savings of approximately ₹8.5 Lakhs over its 25-year lifespan."
    },
    {
      question: "Is solar a better investment than FD or Gold?",
      answer: "Yes, solar offers tax-free returns of over 20% by eliminating expenses, beating both FD (7%) and Gold (10%)."
    },
    {
      question: "What maintenance costs should I expect?",
      answer: "Maintenance is minimal-mostly cleaning. You may need to replace the inverter once in year 11-12 (approx ₹25,000)."
    },
    {
      question: "Does solar increase home resale value?",
      answer: "Yes, homes with zero electricity bills are highly attractive and can command a premium of ₹3-4 Lakhs."
    }
  ];





  // FAQs for the Generation post
  const generationFaqs = [
    {
      question: "How many units does 1kW produce?",
      answer: "In Tamil Nadu, a 1kW solar system produces approximately 4-5 units per day, or about 120-150 units per month."
    },
    {
      question: "How many units does 5kW produce?",
      answer: "A 5kW system generates around 20-22 units per day, totaling 600-660 units per month, which is sufficient for most large homes."
    },
    {
      question: "Does weather affect solar?",
      answer: "Yes, cloudy days and rain reduce generation. However, Tamil Nadu's climate ensures high generation for over 300 days a year."
    },
    {
      question: "Does AC reduce solar efficiency?",
      answer: "No, using an AC increases your consumption, but it does not affect the solar panels' ability to generate power."
    },
    {
      question: "What affects generation the most?",
      answer: "Shading is the biggest factor. Even a small shadow can significantly drop output. Dust accumulation and panel orientation also play key roles."
    }
  ];

  // FAQs for the Myths vs Facts post
  const mythsFaqs = [
    {
      question: "Does solar work in rainy season?",
      answer: "Yes, solar panels work on light intensity, not heat. While generation drops during heavy rain, they still produce power on cloudy days."
    },
    {
      question: "Will my bill become zero?",
      answer: "It is possible if your solar system generates more power than you consume. However, a 'Zero Bill' depends on your usage habits and system size."
    },
    {
      question: "Can I upgrade 3kW to 5kW?",
      answer: "Yes, but it requires changing the inverter and adding more panels, which can be costly. It's better to install the right size from the start."
    },
    {
      question: "What about AC load?",
      answer: "A 5kW system can easily run 1-2 ACs. Even a 3kW system can run a small AC occasionally. Solar is excellent for offsetting high AC bills."
    },
    {
      question: "Does net-metering cost extra?",
      answer: "There are nominal government fees for the net meter and testing, but no recurring monthly charges for the net-metering service itself."
    }
  ];

  // FAQs for the System Types post
  const systemTypesFaqs = [
    {
      question: "Which is better: on-grid or hybrid?",
      answer: "On-grid is better for maximum savings if you have stable power. Hybrid is better if you need backup during power cuts."
    },
    {
      question: "Does on-grid work during power cuts?",
      answer: "No, on-grid systems automatically shut down during power cuts for safety reasons. You need a Hybrid system for backup."
    },
    {
      question: "Is subsidy available for hybrid?",
      answer: "Yes, the PM Surya Ghar subsidy applies to the solar generation part of a Hybrid system, but not the battery cost."
    },
    {
      question: "Do I need battery backup in TN?",
      answer: "In most TN cities with stable power, batteries are not strictly necessary. However, they provide peace of mind and security."
    },
    {
      question: "Can off-grid be connected to the grid?",
      answer: "No, true off-grid systems are completely independent. If you want grid connection + battery, you need a Hybrid system."
    }
  ];

  // FAQs for the Phase Upgrade post
  const phaseUpgradeFaqs = [
    {
      question: "Is 3kW allowed on single-phase?",
      answer: "Yes, TNEB generally allows up to 3kW (sometimes 4kW) on a single-phase connection, but upgrading to 3-phase is often recommended for better stability."
    },
    {
      question: "How much does 3-phase upgrade cost?",
      answer: "The cost typically ranges from ₹8,000 to ₹18,000, covering TNEB fees, meter cost, cabling, and electrician charges."
    },
    {
      question: "Does TNEB approve 5kW on single-phase?",
      answer: "No, for a 5kW solar system, a 3-phase connection is mandatory as per TNEB regulations."
    },
    {
      question: "How long does the upgrade process take?",
      answer: "Once you submit the application and pay the fees, the technical work and meter installation usually take 1-2 weeks."
    },
    {
      question: "Do I need new wiring?",
      answer: "Yes, the service wire from the pole to your meter needs to be changed to a 4-core cable, and your distribution board may need rewiring."
    }
  ];



  // --- NEW 2026 FAQs Definitions ---



  const maintenanceFaqs = [
    { question: "How often should I clean my panels?", answer: "In Cuddalore: Every 10-15 days in summer (dust season), once a month in monsoon. Check visually - if panels look dirty, clean them." },
    { question: "Can I use tap water for cleaning?", answer: "Only if it's soft water. Cuddalore bore water is hard (high TDS). Use RO reject water or rainwater to avoid white calcium spots." },
    { question: "Is annual professional servicing necessary?", answer: "Recommended. A technician checks cable health, earthing resistance, and inverter diagnostics. Costs ₹1,500-2,500/year. Prevents major failures." },
    { question: "My generation dropped suddenly. What should I check?", answer: "(1) Clean the panels, (2) Check inverter display for error codes, (3) Look for new shadows (tree growth, new building), (4) Check if the net meter is working." },
    { question: "Can dust really reduce generation by 20%?", answer: "Yes. A thick dust layer acts like a curtain. Field tests in Tamil Nadu confirm 15-25% loss in neglected systems. Clean panels = more money." }
  ];

  const coastalFaqs = [
    { question: "How far from the coast do I need salt-resistant panels?", answer: "Within 10km of the Bay of Bengal, salt mist is significant. Areas like Devanampattinam, Silver Beach, Pondicherry White Town all need IEC 61701 Level 6 panels." },
    { question: "Can I upgrade my existing structure to galvanized?", answer: "Yes, but it's expensive. You'd need to dismantle panels, remove old structure, install new HDG structure. Usually costs 40% of original system price." },
    { question: "How do I know if my panels have coastal certification?", answer: "Check the module datasheet (PDF). Look for \"IEC 61701\" certification. The severity level should be mentioned. Demand this PDF from your installer." },
    { question: "Is aluminium better than galvanized steel?", answer: "For coastal areas, both work. Aluminium is lighter (good for sheet roofs), HDG is stronger (good for elevated/high-wind structures). We choose based on your specific roof." },
    { question: "Can salt damage already installed panels?", answer: "Yes. If panels aren't coastal-rated, you'll see white powder on frames (corrosion) and performance drops. Replace them before warranty expires." }
  ];

  const scamFaqs = [
    { question: "How do I verify if an installer is certified?", answer: "Ask for: (1) MNRE empanelment certificate, (2) Electrical Contractor License, (3) GST registration. Check PM Surya Ghar portal vendor list." },
    { question: "What if vendor disappears after installation?", answer: "Panel warranty is from manufacturer (not installer). Inverter warranty is from brand. Keep all original invoices and warranty cards safely." },
    { question: "Can I get subsidy if my installer isn't MNRE empanelled?", answer: "No. Only empanelled vendors appear on PM Surya Ghar portal. Using non-empanelled installer = zero subsidy." },
    { question: "How do I check if panels are genuine?", answer: "Scan QR code/barcode on panel. It should show manufacturer details. Fake panels have no QR or lead to random websites." },
    { question: "What's the safest payment method?", answer: "Pay in phases: 30% advance, 40% on installation, 30% after net meter. NEVER pay 100% upfront. Get signed receipts." }
  ];

  const futureFaqs = [
    { question: "Should I wait for better technology before buying?", answer: "No. Waiting means losing 2-3 years of free electricity. Current tech (Mono PERC, Hybrid inverters) is mature and will last 25 years." },
    { question: "Will perovskite panels be available soon in India?", answer: "Lab-stage only. Commercial availability is 5-10 years away. Buy proven tech today rather than waiting for future promises." },
    { question: "Are floating solar farms coming to Cuddalore?", answer: "Possible on Veeranam Lake or farm ponds, but this is for large MW-scale projects (government/commercial), not residential." },
    { question: "Will solar become cheaper in 2027?", answer: "Unlikely. Global silicon prices are rising. Panel prices may increase 5-10%. Buy now to lock current prices and start saving immediately." },
    { question: "What about vehicle-to-grid (V2G) systems?", answer: "Interesting for EV owners, but not mainstream yet. Focus on proven rooftop solar + net metering for now." }
  ];

  const bifacialFaqs = [
    { question: "Can I use Bifacial panels on a normal terrace roof?", answer: "Yes, but you need elevated structure (6-12 inches gap). Ground reflection adds 5-15% extra generation depending on roof color (white is best)." },
    { question: "Are Poly panels still sold in 2026?", answer: "Rarely. 95% of market is Mono PERC or Bifacial. Poly is outdated technology with lower efficiency." },
    { question: "Do Bifacial panels cost more?", answer: "Yes, ~10-15% more than Mono PERC. But the extra generation makes up the difference in 2-3 years." },
    { question: "Can I mix Mono and Bifacial in same system?", answer: "Technically yes, but not recommended. They have different voltage curves. Keep strings uniform for best performance." },
    { question: "Which panel type works best in Cuddalore's climate?", answer: "Mono PERC is standard. Bifacial if you have white terrace tiles or elevated structure. Both work well in hot climates." }
  ];

  const loansFaqs = [
    { question: "What's the minimum CIBIL score needed for a solar loan?", answer: "Most banks require 650+. If your score is lower, consider the PM Surya Ghar scheme which has subsidized rates." },
    { question: "Can I get a loan if I'm self-employed?", answer: "Yes. You need 2 years of ITR and business proof. Some NBFCs are more flexible than banks." },
    { question: "Is the interest tax-deductible?", answer: "For residential systems, no. But if you use solar for a home-based business, you can claim it as a business expense. Consult your CA." },
    { question: "Can I prepay the loan without penalty?", answer: "Most solar loans from Tata Capital, HDFC, yes. But check your sanction letter for prepayment clauses." },
    { question: "What if I sell the house before the loan is paid off?", answer: "The loan is tied to YOU, not the property. You must either: (1) Pay off the loan from the sale proceeds, or (2) Transfer the loan liability to the buyer (rare)." }
  ];

  const comparisonFaqs = [
    { question: "I have 2 ACs. Is 3kW enough or do I need 5kW?", answer: "If both ACs run simultaneously during the day, you need 5kW. If you use them in shifts (1 AC at a time), 3kW with good load management works." },
    { question: "Can I upgrade from 3kW to 5kW later?", answer: "Yes, but it's expensive. You'll need a new inverter, additional panels, and fresh TNEB liaisoning. It's cheaper to install the right size initially." },
    { question: "Will 3kW run my home during a power cut?", answer: "Standard On-Grid systems don't work during cuts. You need a Hybrid system with battery for backup. That costs 40% more than On-Grid." },
    { question: "My neighbor has 3kW and generates more units than me. Why?", answer: "Check for: (1) Shadow on your panels, (2) Dust accumulation, (3) Panel orientation (South is best), (4) Inverter efficiency. Ask us for a health check." },
    { question: "Can I run a submersible pump with 3kW?", answer: "A 1HP pump draws ~1kW. Yes, 3kW can run it during the day. But for agriculture, you might need 5-10kW depending on pump size." }
  ];

  const subsidyFaqs = [
    { question: "Can I apply if my electricity bill is in my father's name?", answer: "The subsidy and EB bill name must match. You have two options: (1) Transfer the EB connection to your name first, or (2) Open a joint bank account with your father for subsidy credit." },
    { question: "How long does TNEB take to approve feasibility?", answer: "In Cuddalore, feasibility approval is usually auto-generated within 3-7 days on the National Portal. Manual delays happen only if the local transformer is overloaded." },
    { question: "Can I get subsidy for a 5kW system?", answer: "Yes, you can install 5kW. But the subsidy is capped at ₹78,000 (for 3kW capacity). The extra 2kW gets no subsidy but still generates free power." },
    { question: "What if I already installed solar last year without knowing about the scheme?", answer: "Retroactive claims are not allowed. The subsidy application must be filed BEFORE installation. Existing systems are not eligible." },
    { question: "Is there a deadline for 2026?", answer: "The scheme is ongoing until the national target of 1 crore homes is met. However, apply early as processingcan slow down if there's a rush at year-end." }
  ];

  const resaleValueFaqs = [
    { question: "Does the bank value the solar system in a Home Loan?", answer: "Yes. Modern valuers include the cost of fixed assets like Solar Power Plants in the total valuation of the property. This helps the buyer get a higher loan amount." },
    { question: "What if the panels are 10 years old?", answer: "Solar panels have a life of 25 years. A 10-year-old system still has 15 years of life left. It usually operates at 90% efficiency. It is still a highly valuable asset." },
    { question: "Can I take the solar system with me to my new house?", answer: "Technically, yes. But financially, no. The cost of dismantling, transport, and re-installation (plus new liaisoning) is high. It is almost always better to sell it with the house (for a premium) and buy a brand new system for your new home." },
    { question: "Do I need to inform TNEB?", answer: "Only the standard name transfer is required. No special solar permission is needed to sell the house." },
    { question: "How much premium can I realistically ask?", answer: "Market data shows 4-6% premium in Cuddalore. For an ₹80 lakh property, that means ₹3-5 lakhs extra. The key is to market it explicitly as a \"Zero Bill Home\" in your listing." }
  ];

  const commercialTaxFaqs = [
    { question: "Can I claim depreciation if I'm under GST composition scheme?", answer: "Yes for income tax. It's separate from GST. Consult your CA to file ITR correctly." },
    { question: "Do I get depreciation every year?", answer: "Yes. 40% in Year 1 (WDV). Year 2 gets 40% of remaining value. Continues till asset value nears zero." },
    { question: "Can I claim both subsidy and depreciation?", answer: "Residential subsidies and commercial depreciation are separate schemes. If you install at factory/office, you get depreciation. Subsidy is only for homes." },
    { question: "What if I install solar before Sept 30?", answer: "You get 100% of the depreciation (40%) in that financial year. After Sept 30, you get only 50% (20%) that year." },
    { question: "Can a school or trust claim depreciation?", answer: "Yes, if they have taxable income from other activities. Non-profit trusts with zero tax liability gain nothing from depreciation." }
  ];

  const zedFaqs = [
    { question: "Can I use solar without net meter using ZED?", answer: "Yes. ZED ensures you only use what you generate. No export = no TNEB approval needed initially. But for subsidy, you need net meter eventually." },
    { question: "Does ZED reduce my generation?", answer: "No. It intelligently limits export. If you're consuming 2kW and generating 4kW, extra 2kW is curtailed instead of exported." },
    { question: "Can I remove ZED later after getting net meter?", answer: "Yes. Once net meter is installed, you can disable/remove the ZED function. The inverter works normally." },
    { question: "Which inverters have built-in ZED?", answer: "Deye, GoodWe, SolaX hybrids. Most modern inverters have this feature. Older models need external ZED module." },
    { question: "Is ZED legal in Tamil Nadu?", answer: "Yes. TNEB allows it as a temporary measure until net meter arrives. Final commissioning still needs TNEB approval." }
  ];

  const tnebBillFaqs = [
    { question: "Why is my bill not zero even with solar?", answer: "You pay fixed charges (₹20-150/month) + any excess consumption beyond generation. Check your net export vs import." },
    { question: "What happens to units I export to TNEB?", answer: "They are \"banked\" (stored as credit). You can use them in future months. Banking expires after 1 financial year." },
    { question: "Can I get cash for excess units?", answer: "No. TNEB doesn't pay for surplus. Design your system to match consumption, not overproduce." },
    { question: "How do I read the net meter display?", answer: "kWh received = What you imported from grid. kWh delivered = What you exported. Net = Delivered - Received." },
    { question: "My neighbor has same solar but lower bill. Why?", answer: "Compare: (1) System size, (2) Sanctioned load (fixed charges vary), (3) Billing cycle dates. Bills are personalized." }
  ];

  const enphaseFaqs = [
    { question: "Is Enphase available in Cuddalore?", answer: "Yes. Surya's Solar is a certified Enphase partner. We stock IQ8+ micro-inverters." },
    { question: "Can I monitor each panel separately?", answer: "Yes. The Enphase app shows panel-level generation. You can see exactly which panel is underperforming." },
    { question: "What is the warranty?", answer: "25 years on micro-inverters. Compared to 5-10 years on string inverters. This alone justifies the cost." },
    { question: "Can I expand my system later?", answer: "Easily. Add 1 panel + 1 micro-inverter at a time. No need to reconfigure strings like in traditional systems." },
    { question: "Does Enphase work during power cuts?", answer: "The IQ8+ model works with Encharge battery for backup. Standard IQ7 does not. Clarify your model." }
  ];

  const voltageFaqs = [
    { question: "How do I know if I have low voltage issues?", answer: "Buy a voltmeter (₹200). Check at 11 AM and 2 PM. If readings <190V consistently, you need Hybrid, not On-Grid." },
    { question: "Can I add battery to my existing On-Grid system?", answer: "Not directly. You need to replace the On-Grid inverter with a Hybrid inverter. We offer exchange discounts." },
    { question: "How much battery capacity do I need?", answer: "For 5 hours backup: 1kWh per kW of load. Example: 2kW load (fans, lights, TV) needs 10kWh battery." },
    { question: "Do Hybrid inverters work during power cuts?", answer: "Yes. They automatically switch to battery power. Your appliances keep running seamlessly." },
    { question: "Is Hybrid worth the extra cost?", answer: "If you live in Panruti/Vadalur with frequent voltage drops OR you want backup, yes. Else, stick with On-Grid." }
  ];

  const dcCableFaqs = [
    { question: "Can I use normal house wire for solar?", answer: "Never. House wire (PVC) degrades under UV. Solar DC cable has XLPO insulation rated for 25 years outdoors." },
    { question: "What is \"tinned copper\" and why does it matter?", answer: "Copper plated with tin. Prevents oxidation and galvanic corrosion in coastal climates like Cuddalore. Bare copper turns green and fails." },
    { question: "How do I verify if my installer used quality cable?", answer: "Check the cable print. It should say \"Solar Cable\", \"1.5kV DC\", and brand name (Polycab/Siechem). Silver-colored strands = tinned copper." },
    { question: "Can I reuse old solar cables if I upgrade?", answer: "If <5 years old AND UV-rated, yes. But cables are 10% of system cost. False  savings here risk your entire investment." },
    { question: "What is MC4 connector and is it really necessary?", answer: "It's a waterproof, click-lock connector standard in solar. Rated IP68. Using tape or wire nuts is illegal and fire-hazardous." }
  ];

  const earthingFaqs = [
    { question: "Can I use the same earthing pit for AC and DC?", answer: "No. IS 3043 mandates separate pits for safety. Sharing pits can cause dangerous back-currents during faults." },
    { question: "How do I test if my earthing is working?", answer: "Use an Earth Tester. Insert probes into the ground, measure resistance. Should be <5 Ohms. We do this for free during installation." },
    { question: "What happens if lightning strikes my panels?", answer: "The Lightning Arrester on the roof captures the surge and channels it to the LA earthing pit. Your panels and inverter are safe. This is why LA earthing is separate." },
    { question: "Do I need to water earthing pits?", answer: "Not if you use Chemical Earthing (BFC compound). It's maintenance-free. Salt/charcoal pits need monthly watering." },
    { question: "Can earthing pits corrode over time?", answer: "GI pipes corrode in 3-5 years. Copper-bonded rods last 15-20 years. We only use copper-bonded for durability." }
  ];

  const shadowFaqs = [
    { question: "Can I install panels if I have a coconut tree nearby?", answer: "It depends on the distance and height. Use the 2X rule: If tree is 30ft tall, panels should be 60ft away. We do free shadow analysis." },
    { question: "What if shadow only falls in the morning or evening?", answer: "Morning/evening shadow (before 9 AM, after 4 PM) causes minimal loss. Peak shadow (10 AM - 2 PM) is critical. Design your layout to avoid peak shadow." },
    { question: "Are Half-Cut panels more expensive?", answer: "They cost 5-10% more than standard panels, but the performance gain in partially shaded conditions easily justifies the cost." },
    { question: "Can I trim my neighbor's tree if it shades my panels?", answer: "Legally, no. Trees on their property are their right. Better solutions: Use Enphase micro-inverters or elevate your structure." },
    { question: "What is a Bypass Diode and how does it help?", answer: "It's a safety component inside the panel that reroutes current around shaded cells. Prevents hotspots and reduces loss. All good panels have them." }
  ];

  let matchedFaqs = costFaqs;
  const t = post.title.toLowerCase();

  if (t.includes("roi") || t.includes("calculator")) {
    matchedFaqs = roiFaqs;
  } else if (t.includes("brands") || t.includes("panel")) {
    matchedFaqs = brandsFaqs;
  } else if (t.includes("subsidy") || t.includes("scheme")) {
    matchedFaqs = subsidyFaqs;
  } else if (t.includes("inverter") && !t.includes("micro")) {
    matchedFaqs = inverterFaqs;
  } else if (t.includes("rust") || t.includes("coastal")) {
    matchedFaqs = coastalFaqs;
  } else if (t.includes("net meter") || t.includes("how to get tneb")) {
    matchedFaqs = netMeteringFaqs;
  } else if (t.includes("3kw") || t.includes("price") || t.includes("cost")) {
    matchedFaqs = comparisonFaqs;
  } else if (t.includes("generation")) {
    matchedFaqs = generationFaqs;
  } else if (t.includes("myth")) {
    matchedFaqs = mythsFaqs;
  } else if (t.includes("on-grid vs hybrid") || t.includes("system type")) {
    matchedFaqs = systemTypesFaqs;
  } else if (t.includes("hybrid") || t.includes("on-grid")) {
    matchedFaqs = inverterFaqs;
  } else if (t.includes("phase upgrade")) {
    matchedFaqs = phaseUpgradeFaqs;
  } else if (t.includes("loan") || t.includes("emi") || t.includes("finance")) {
    matchedFaqs = loansFaqs;
  } else if (t.includes("maintenance") || t.includes("clean")) {
    matchedFaqs = maintenanceFaqs;
  } else if (t.includes("scam") || t.includes("warning")) {
    matchedFaqs = scamFaqs;
  } else if (t.includes("future") || t.includes("trends")) {
    matchedFaqs = futureFaqs;
  } else if (t.includes("bifacial") || t.includes("mono")) {
    matchedFaqs = bifacialFaqs;
  } else if (t.includes("resale") || t.includes("value") || t.includes("real estate")) {
    matchedFaqs = resaleValueFaqs;
  } else if (t.includes("tax") || t.includes("depreciation") || t.includes("commercial")) {
    matchedFaqs = commercialTaxFaqs;
  } else if (t.includes("zero export") || t.includes("zed")) {
    matchedFaqs = zedFaqs;
  } else if (t.includes("tneb solar bill") || t.includes("import vs export")) {
    matchedFaqs = tnebBillFaqs;
  } else if (t.includes("enphase") || t.includes("micro-inverter")) {
    matchedFaqs = enphaseFaqs;
  } else if (t.includes("voltage") || t.includes("fluctuation")) {
    matchedFaqs = voltageFaqs;
  } else if (t.includes("cable") || t.includes("wire") || t.includes("fire")) {
    matchedFaqs = dcCableFaqs;
  } else if (t.includes("earthing") || t.includes("safety") || t.includes("lightning") || t.includes("grounding")) {
    matchedFaqs = earthingFaqs;
  } else if (t.includes("shadow") || t.includes("shading") || t.includes("tree")) {
    matchedFaqs = shadowFaqs;
  }

  return matchedFaqs
}
