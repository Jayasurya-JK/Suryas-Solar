import os
import re

blog_dir = r"c:\Website Projects\Suryas-Solar\Web\content\blog"

# Enhanced CTA and Related Articles mapping based on topic clusters
blog_enhancements = {
    "2026-01-01-pm-surya-ghar-scheme-cuddalore-2026.md": {
        "cta_title": "Not Sure About Your Subsidy Eligibility?",
        "cta_text": "Use our subsidy calculator or book a free consultation to understand your exact subsidy amount and application process.",
        "cta_buttons": "**[Check Subsidy Eligibility](/cost-calculator)** | **[Book Free Consultation](/contact)**",
        "related": [
            ("Calculate Your Solar ROI", "/blog/2026-01-08-solar-roi-calculator-break-even-analysis", "See complete financial breakdown with subsidy"),
            ("Solar EMI Options", "/blog/2026-01-03-solar-emi-loans-tamil-nadu-2026", "Finance your system after subsidy"),
            ("TNEB Net Meter Process", "/blog/2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026", "Complete liaisoning guide")
        ]
    },
    "2026-01-02-is-3kw-solar-enough-for-3bhk-2026.md": {
        "cta_title": "Confused About the Right System Size?",
        "cta_text": "Get a free load analysis for your home. Our engineers will calculate your exact requirement based on your appliances and usage patterns.",
        "cta_buttons": "**[Get Free Load Analysis](/contact)** | **[Try Solar Calculator](/cost-calculator)**",
        "related": [
            ("Understanding Your TNEB Bill", "/blog/2026-01-17-understanding-tneb-solar-bill", "Learn how billing works"),
            ("Solar ROI Calculator", "/blog/2026-01-08-solar-roi-calculator-break-even-analysis", "Calculate your payback period"),
            ("PM Surya Ghar Subsidy", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "Get ₹30,000 subsidy for 3kW")
        ]
    },
    "2026-01-03-solar- emi-loans-tamil-nadu-2026.md": {
        "cta_title": "Need Help With Solar Financing?",
        "cta_text": "We partner with leading banks for solar loans. Get instant EMI quotes and pre-approved loan offers with minimal documentation.",
        "cta_buttons": "**[Get Loan Quote](/contact)** | **[Check EMI Calculator](/cost-calculator)**",
        "related": [
            ("PM Surya Ghar Subsidy", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "Reduce loan amount with subsidy"),
            ("Tax Benefits for Business", "/blog/2026-01-19-commercial-solar-tax-benefits", "40% depreciation benefits"),
            ("Solar ROI Analysis", "/blog/2026-01-08-solar-roi-calculator-break-even-analysis", "Full financial breakdown")
        ]
    },
    "2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026.md": {
        "cta_title": "Stuck in TNEB Paperwork?",
        "cta_text": "We handle complete TNEB liaisoning, net meter application, and approvals. Get your system connected to the grid hassle-free.",
        "cta_buttons": "**[Get Liaisoning Support](/contact)** | **[Check Timeline](/cost-calculator)**",
        "related": [
            ("Understanding Your TNEB Bill", "/blog/2026-01-17-understanding-tneb-solar-bill", "How net metering billing works"),
            ("Zero Export Device Guide", "/blog/2026-01-18-zero-export-device-guide", "Start using solar before net meter"),
            ("PM Surya Ghar Subsidy", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "Subsidy application process")
        ]
    },
    "2026-01-10-solar-maintenance-guide-cuddalore.md": {
        "cta_title": "Need Professional Maintenance Service?",
        "cta_text": "Schedule annual maintenance with our certified technicians. We offer complete cleaning, inspection, and performance optimization services.",
        "cta_buttons": "**[Schedule Maintenance](/contact)** | **[Get Service Quote](/cost-calculator)**",
        "related": [
            ("DC Cable Quality Guide", "/blog/2026-01-14-solar-dc-cable-quality-guide", "Check cable health"),
            ("Earthing Safety Guide", "/blog/2026-01-13-solar-earthing-safety-guide", "Ensure proper grounding"),
            ("Shadow Analysis Guide", "/blog/2026-01-12-solar-shadow-analysis-guide-cuddalore", "Optimize panel placement")
        ]
    },
    "2026-01-12-solar-shadow-analysis-guide-cuddalore.md": {
        "cta_title": "Worried About Shadows on Your Roof?",
        "cta_text": "Get a free shadow analysis report using professional tools. We'll design your system to maximize generation despite obstacles.",
        "cta_buttons": "**[Get Shadow Report](/contact)** | **[Design Your System](/cost-calculator)**",
        "related": [
            ("Enphase Micro-Inverters", "/blog/2026-01-16-enphase-micro-inverter-review", "Best solution for shaded roofs"),
            ("Panel Maintenance Guide", "/blog/2026-01-10-solar-maintenance-guide-cuddalore", "Keep panels clean for maximum output"),
            ("Voltage Solutions", "/blog/2026-01-15-voltage-fluctuation-hybrid-solar", "Hybrid systems for better performance")
        ]
    },
    "2026-01-13-solar-earthing-safety-guide.md": {
        "cta_title": "Concerned About Safety Standards?",
        "cta_text": "Get a free safety audit of your solar installation. We check earthing, wiring, and structural integrity to ensure compliance.",
        "cta_buttons": "**[Book Safety Audit](/contact)** | **[Check Standards](/cost-calculator)**",
        "related": [
            ("DC Cable Quality", "/blog/2026-01-14-solar-dc-cable-quality-guide", "Fire-safe wiring standards"),
            ("Maintenance Guide", "/blog/2026-01-10-solar-maintenance-guide-cuddalore", "Regular safety checks"),
            ("TNEB Net Meter Guide", "/blog/2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026", "TNEB safety certificate process")
        ]
    },
    "2026-01-14-solar-dc-cable-quality-guide.md": {
        "cta_title": "Want a Quality Inspection?",
        "cta_text": "Our engineers can inspect your existing installation for cable quality and fire safety compliance. Get a detailed audit report.",
        "cta_buttons": "**[Book Quality Audit](/contact)** | **[Get Inspection Quote](/cost-calculator)**",
        "related": [
            ("Earthing Safety Guide", "/blog/2026-01-13-solar-earthing-safety-guide", "Complete safety checklist"),
            ("Shadow Analysis", "/blog/2026-01-12-solar-shadow-analysis-guide-cuddalore", "Optimize wire routing"),
            ("Maintenance Tips", "/blog/2026-01-10-solar-maintenance-guide-cuddalore", "Cable inspection schedule")
        ]
    },
    "2026-01-15-voltage-fluctuation-hybrid-solar.md": {
        "cta_title": "Experiencing Grid Voltage Issues?",
        "cta_text": "Test your grid voltage and get recommendations for hybrid inverter solutions. Protect your investment from power quality problems.",
        "cta_buttons": "**[Book Voltage Test](/contact)** | **[Compare Systems](/cost-calculator)**",
        "related": [
            ("On-Grid vs Hybrid", "/blog/2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu", "Choose the right system"),
            ("Enphase Solutions", "/blog/2026-01-16-enphase-micro-inverter-review", "Premium voltage-independent option"),
            ("Zero Export Device", "/blog/2026-01-18-zero-export-device-guide", "Grid compatibility solutions")
        ]
    },
    "2026-01-16-enphase-micro-inverter-review.md": {
        "cta_title": "Ready for Premium Solar?",
        "cta_text": "Get a customized Enphase system quote for your property. We'll show you the exact ROI and safety benefits for your specific situation.",
        "cta_buttons": "**[Get Enphase Quote](/contact)** | **[Compare Costs](/cost-calculator)**",
        "related": [
            ("Shadow Analysis", "/blog/2026-01-12-solar-shadow-analysis-guide-cuddalore", "Why Enphase excels in shade"),
            ("Voltage Solutions", "/blog/2026-01-15-voltage-fluctuation-hybrid-solar", "Compare with hybrid systems"),
            ("DC Cable Safety", "/blog/2026-01-14-solar-dc-cable-quality-guide", "Understand AC vs DC wiring")
        ]
    },
    "2026-01-17-understanding-tneb-solar-bill.md": {
        "cta_title": "Bill Not Matching Expectations?",
        "cta_text": "Book a free bill analysis session. We'll review your consumption patterns and solar generation to optimize your savings.",
        "cta_buttons": "**[Analyze My Bill](/contact)** | **[Calculate Savings](/cost-calculator)**",
        "related": [
            ("TNEB Net Meter Process", "/blog/2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026", "How net metering works"),
            ("Solar ROI Calculator", "/blog/2026-01-08-solar-roi-calculator-break-even-analysis", "Financial breakdown"),
            ("System Sizing Guide", "/blog/2026-01-02-is-3kw-solar-enough-for-3bhk-2026", "Right size for zero bills")
        ]
    },
    "2026-01-18-zero-export-device-guide.md": {
        "cta_title": "Want to Start Using Solar Immediately?",
        "cta_text": "Get a ZED-compatible inverter installed and start saving from day one, even before your TNEB net meter arrives.",
        "cta_buttons": "**[Get ZED Installation](/contact)** | **[Check Compatibility](/cost-calculator)**",
        "related": [
            ("TNEB Net Meter Guide", "/blog/2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026", "Full net metering process"),
            ("Hybrid Systems", "/blog/2026-01-15-voltage-fluctuation-hybrid-solar", "ZED-enabled hybrid inverters"),
            ("Understanding TNEB Bill", "/blog/2026-01-17-understanding-tneb-solar-bill", "How billing will work later")
        ]
    },
    "2026-01-19-commercial-solar-tax-benefits.md": {
        "cta_title": "Need Tax Planning Support?",
        "cta_text": "Our commercial solar experts will coordinate with your CA to maximize your depreciation benefits and ROI.",
        "cta_buttons": "**[Get Commercial Quote](/contact)** | **[Calculate Tax Savings](/cost-calculator)**",
        "related": [
            ("Solar Financing Options", "/blog/2026-01-03-solar-emi-loans-tamil-nadu-2026", "Business loan solutions"),
            ("ROI Analysis", "/blog/2026-01-08-solar-roi-calculator-break-even-analysis", "Complete financial breakdown"),
            ("TNEB Net Meter", "/blog/2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026", "Commercial liaisoning process")
        ]
    }
}

def add_enhancements(filepath, filename):
    if filename not in blog_enhancements:
        return False
        
    with open(filepath, "r", encoding="utf-8", errors='ignore') as f:
        content = f.read()
    
    enhancement = blog_enhancements[filename]
    
    # Build CTA box
    cta_box = f"""---

> **{enhancement['cta_title']}**
> 
> {enhancement['cta_text']}
> 
> {enhancement['cta_buttons']}

---

"""
    
    # Build Related Articles section
    related_section = "\n---\n\n## Related Articles\n\n"
    for title, link, desc in enhancement['related']:
        related_section += f"- **[{title}]({link})** - {desc}\n"
    related_section += "\n"
    
    # Insert CTA box before the last 3 sections (usually before FAQ or Conclusion)
    # Strategy: Find the 3rd-to-last ## heading
    headings = list(re.finditer(r'\n## \d+\.', content))
    if len(headings) >= 3:
        insert_pos = headings[-3].start()
        content = content[:insert_pos] + "\n" + cta_box + content[insert_pos:]
    
    # Insert Related Articles before CONTACT_CTA component
    content = content.replace("<!-- COMPONENT: CONTACT_CTA -->", related_section + "<!-- COMPONENT: CONTACT_CTA -->")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    return True

# Process all blogs
for filename in os.listdir(blog_dir):
    if filename.startswith("2026-") and filename.endswith(".md") and filename != "2026-01-20-solar-increases-home-resale-value.md":
        filepath = os.path.join(blog_dir, filename)
        if add_enhancements(filepath, filename):
            print(f"Enhanced: {filename}")
        else:
            print(f"Skipped (no config): {filename}")
