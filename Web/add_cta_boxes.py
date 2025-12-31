import os
import re

blog_dir = r"c:\Website Projects\Suryas-Solar\Web\content\blog"

# CTA boxes for each blog (to be inserted before section 5 or before "Comparison" or "FAQ" section)
cta_configs = {
    "2026-01-01-pm-surya-ghar-scheme-cuddalore-2026.md": {
        "title": "Not Sure About Your Subsidy Eligibility?",
        "text": "Use our subsidy calculator or book a free consultation to understand your exact subsidy amount and application process.",
        "buttons": "**[Check Subsidy Eligibility](/cost-calculator)** | **[Book Free Consultation](/contact)**",
        "insert_before": "## 5."
    },
    "2026-01-02-is-3kw-solar-enough-for-3bhk-2026.md": {
        "title": "Confused About the Right System Size?",
        "text": "Get a free load analysis for your home. Our engineers will calculate your exact requirement based on your appliances and usage patterns.",
        "buttons": "**[Get Free Load Analysis](/contact)** | **[Try Solar Calculator](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-03-solar-emi-loans-tamil-nadu-2026.md": {
        "title": "Need Help With Solar Financing?",
        "text": "We partner with leading banks for solar loans. Get instant EMI quotes and pre-approved loan offers with minimal documentation.",
        "buttons": "**[Get Loan Quote](/contact)** | **[Check EMI Calculator](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026.md": {
        "title": "Stuck in TNEB Paperwork?",
        "text": "We handle complete TNEB liaisoning, net meter application, and approvals. Get your system connected to the grid hassle-free.",
        "buttons": "**[Get Liaisoning Support](/contact)** | **[Check Timeline](/cost-calculator)**",
        "insert_before": "## "
    },
    "2026-01-10-solar-maintenance-guide-cuddalore.md": {
        "title": "Need Professional Maintenance Service?",
        "text": "Schedule annual maintenance with our certified technicians. We offer complete cleaning, inspection, and performance optimization services.",
        "buttons": "**[Schedule Maintenance](/contact)** | **[Get Service Quote](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-12-solar-shadow-analysis-guide-cuddalore.md": {
        "title": "Worried About Shadows on Your Roof?",
        "text": "Get a free shadow analysis report using professional tools. We'll design your system to maximize generation despite obstacles.",
        "buttons": "**[Get Shadow Report](/contact)** | **[Design Your System](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-13-solar-earthing-safety-guide.md": {
        "title": "Concerned About Safety Standards?",
        "text": "Get a free safety audit of your solar installation. We check earthing, wiring, and structural integrity to ensure compliance.",
        "buttons": "**[Book Safety Audit](/contact)** | **[Check Standards](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-14-solar-dc-cable-quality-guide.md": {
        "title": "Want a Quality Inspection?",
        "text": "Our engineers can inspect your existing installation for cable quality and fire safety compliance. Get a detailed audit report.",
        "buttons": "**[Book Quality Audit](/contact)** | **[Get Inspection Quote](/cost-calculator)**",
        "insert_before": "## 6."
    },
    "2026-01-15-voltage-fluctuation-hybrid-solar.md": {
        "title": "Experiencing Grid Voltage Issues?",
        "text": "Test your grid voltage and get recommendations for hybrid inverter solutions. Protect your investment from power quality problems.",
        "buttons": "**[Book Voltage Test](/contact)** | **[Compare Systems](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-16-enphase-micro-inverter-review.md": {
        "title": "Ready for Premium Solar?",
        "text": "Get a customized Enphase system quote for your property. We'll show you the exact ROI and safety benefits for your specific situation.",
        "buttons": "**[Get Enphase Quote](/contact)** | **[Compare Costs](/cost-calculator)**",
        "insert_before": "## 4."
    },
    "2026-01-17-understanding-tneb-solar-bill.md": {
        "title": "Bill Not Matching Expectations?",
        "text": "Book a free bill analysis session. We'll review your consumption patterns and solar generation to optimize your savings.",
        "buttons": "**[Analyze My Bill](/contact)** | **[Calculate Savings](/cost-calculator)**",
        "insert_before": "## 4."
    },
    "2026-01-18-zero-export-device-guide.md": {
        "title": "Want to Start Using Solar Immediately?",
        "text": "Get a ZED-compatible inverter installed and start saving from day one, even before your TNEB net meter arrives.",
        "buttons": "**[Get ZED Installation](/contact)** | **[Check Compatibility](/cost-calculator)**",
        "insert_before": "## 5."
    },
    "2026-01-19-commercial-solar-tax-benefits.md": {
        "title": "Need Tax Planning Support?",
        "text": "Our commercial solar experts will coordinate with your CA to maximize your depreciation benefits and ROI.",
        "buttons": "**[Get Commercial Quote](/contact)** | **[Calculate Tax Savings](/cost-calculator)**",
        "insert_before": "## 5."
    }
}

def add_cta_box(filepath, filename):
    if filename not in cta_configs:
        return False
        
    with open(filepath, "r", encoding="utf-8", errors='ignore') as f:
        content = f.read()
    
    config = cta_configs[filename]
    
    # Build CTA box
    cta_box = f"""---

> **{config['title']}**
> 
> {config['text']}
> 
> {config['buttons']}

---

"""
    
    # Find insertion point
    pattern = re.escape(config['insert_before'])
    match = re.search(pattern, content)
    
    if match:
        insert_pos = match.start()
        content = content[:insert_pos] + cta_box + content[insert_pos:]
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    
    return False

# Process all configured blogs
for filename in cta_configs.keys():
    filepath = os.path.join(blog_dir, filename)
    if os.path.exists(filepath):
        if add_cta_box(filepath, filename):
            print(f"Added CTA to: {filename}")
        else:
            print(f" Failed (no match): {filename}")
    else:
        print(f"File not found: {filename}")
