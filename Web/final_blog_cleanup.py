import os
import re
from pathlib import Path

blog_dir = Path(r"c:\Website Projects\Suryas-Solar\Web\content\blog")

# ============================================================================
# COMPREHENSIVE BLOG CLEANUP SCRIPT
# Removes: Emojis, Double lines, Formatting issues
# Adds: Missing FAQs, Related Articles, CTA boxes
# ============================================================================

# FAQ content for blogs missing them (Blogs 05-11)
missing_faqs = {
    "2026-01-05-coastal-solar-rust-proof-panels-cuddalore.md": """## FAQ: Coastal Solar Protection

**Q: How far from the coast do I need salt-resistant panels?**

**A:** Within 10km of the Bay of Bengal, salt mist is significant. Areas like Devanampattinam, Silver Beach, Pondicherry White Town all need IEC 61701 Level 6 panels.

**Q: Can I upgrade my existing structure to galvanized?**

**A:** Yes, but it's expensive. You'd need to dismantle panels, remove old structure, install new HDG structure. Usually costs 40% of original system price.

**Q: How do I know if my panels have coastal certification?**

**A:** Check the module datasheet (PDF). Look for "IEC 61701" certification. The severity level should be mentioned. Demand this PDF from your installer.

**Q: Is aluminium better than galvanized steel?**

**A:** For coastal areas, both work. Aluminium is lighter (good for sheet roofs), HDG is stronger (good for elevated/high-wind structures). We choose based on your specific roof.

**Q: Can salt damage already installed panels?**

**A:** Yes. If panels aren't coastal-rated, you'll see white powder on frames (corrosion) and performance drops. Replace them before warranty expires.""",

    "2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu.md": """## FAQ: System Type Selection

**Q: Can I convert On-Grid to Hybrid later?**

**A:** Yes, but you need to replace the inverter and add batteries. The panels/structure remain same. Total cost: ~₹1.5-2 lakhs for battery upgrade.

**Q: Do Hybrid systems work during power cuts WITHOUT battery?**

**A:** No. Standard hybrids need battery to provide backup. Some new models (Deye, SolaX) have "EPS mode" that gives limited backup from panels only during daytime.

**Q: Which is better for Cuddalore - On-Grid or Hybrid?**

**A:** If you have good grid stability and rare cuts, choose On-Grid (cheaper). If voltage fluctuates or you have frequent cuts, choose Hybrid.

**Q: Can I claim subsidy for Hybrid systems?**

**A:** Yes. PM Surya Ghar subsidy applies to both On-Grid and Hybrid residential systems equally.

**Q: Do batteries need AC for cooling?**

**A:** Lithium batteries (LiFePO4) don't need AC. Lead-acid batteries work best in cool rooms but don't strictly need AC. Avoid installing in direct sunlight rooms.""",

    "2026-01-07-mono-vs-bifacial-solar-panels.md": """## FAQ: Panel Technology

**Q: Can I use Bifacial panels on a normal terrace roof?**

**A:** Yes, but you need elevated structure (6-12 inches gap). Ground reflection adds 5-15% extra generation depending on roof color (white is best).

**Q: Are Poly panels still sold in 2026?**

**A:** Rarely. 95% of market is Mono PERC or Bifacial. Poly is outdated technology with lower efficiency.

**Q: Do Bifacial panels cost more?**

**A:** Yes, ~10-15% more than Mono PERC. But the extra generation makes up the difference in 2-3 years.

**Q: Can I mix Mono and Bifacial in same system?**

**A:** Technically yes, but not recommended. They have different voltage curves. Keep strings uniform for best performance.

**Q: Which panel type works best in Cuddalore's climate?**

**A:** Mono PERC is standard. Bifacial if you have white terrace tiles or elevated structure. Both work well in hot climates.""",

    "2026-01-08-solar-roi-calculator-break-even-analysis.md": """## FAQ: ROI & Payback

**Q: Does ROI calculation include battery cost?**

**A:** Our On-Grid ROI doesn't include battery. For Hybrid, add ₹1.5L battery cost, increasing payback to 6-7 years instead of 4-5.

**Q: What if electricity prices increase faster than expected?**

**A:** That improves your ROI. Every ₹1/unit increase in TNEB tariff reduces your payback period by 6-12 months.

**Q: Do I calculate ROI before or after subsidy?**

**A:** After subsidy. Your actual investment is (Total Cost - ₹78,000 subsidy). Calculate payback on net investment.

**Q: What happens to ROI if my consumption increases?**

**A:** If you add more appliances (new AC, EV charger), your ROI improves because you're avoiding higher per-unit costs in higher tariff slabs.

**Q: Should I factor in maintenance cost?**

**A:** Yes. Add ₹2,000/year for cleaning + ₹3,000/year for inverter/panel health checks. Total ₹5k/year. Still, ROI remains strong.""",

    "2026-01-09-solar-scam-warnings-cuddalore.md": """## FAQ: Scam Prevention

**Q: How do I verify if an installer is certified?**

**A:** Ask for: (1) MNRE empanelment certificate, (2) Electrical Contractor License, (3) GST registration. Check PM Surya Ghar portal vendor list.

**Q: What if vendor disappears after installation?**

**A:** Panel warranty is from manufacturer (not installer). Inverter warranty is from brand. Keep all original invoices and warranty cards safely.

**Q: Can I get subsidy if my installer isn't MNRE empanelled?**

**A:** No. Only empanelled vendors appear on PM Surya Ghar portal. Using non-empanelled installer = zero subsidy.

**Q: How do I check if panels are genuine?**

**A:** Scan QR code/barcode on panel. It should show manufacturer details. Fake panels have no QR or lead to random websites.

**Q: What's the safest payment method?**

**A:** Pay in phases: 30% advance, 40% on installation, 30% after net meter. NEVER pay 100% upfront. Get signed receipts.""",

    "2026-01-11-future-of-solar-tamil-nadu-trends.md": """## FAQ: Solar Technology Trends

**Q: Should I wait for better technology before buying?**

**A:** No. Waiting means losing 2-3 years of free electricity. Current tech (Mono PERC, Hybrid inverters) is mature and will last 25 years.

**Q: Will perovskite panels be available soon in India?**

**A:** Lab-stage only. Commercial availability is 5-10 years away. Buy proven tech today rather than waiting for future promises.

**Q: Are floating solar farms coming to Cuddalore?**

**A:** Possible on Veeranam Lake or farm ponds, but this is for large MW-scale projects (government/commercial), not residential.

**Q: Will solar become cheaper in 2027?**

**A:** Unlikely. Global silicon prices are rising. Panel prices may increase 5-10%. Buy now to lock current prices and start saving immediately.

**Q: What about vehicle-to-grid (V2G) systems?**

**A:** Interesting for EV owners, but not mainstream yet. Focus on proven rooftop solar + net metering for now."""
}

# Related Articles for blogs missing them
missing_related = {
    "2026-01-05-coastal-solar-rust-proof-panels-cuddalore.md": [
        ("Panel Maintenance Guide", "/blog/2026-01-10-solar-maintenance-guide-cuddalore", "Coastal cleaning tips"),
        ("DC Cable Quality", "/blog/2026-01-14-solar-dc-cable-quality-guide", "Salt-resistant wiring"),
        ("Shadow Analysis", "/blog/2026-01-12-solar-shadow-analysis-guide-cuddalore", "Optimize panel placement")
    ],
    "2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu.md": [
        ("Voltage Solutions", "/blog/2026-01-15-voltage-fluctuation-hybrid-solar", "When to choose Hybrid"),
        ("PM Surya Ghar Subsidy", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "Available for both types"),
        ("System Sizing", "/blog/2026-01-02-is-3kw-solar-enough-for-3bhk-2026", "Right capacity selection")
    ],
    "2026-01-07-mono-vs-bifacial-solar-panels.md": [
        ("Coastal Panel Selection", "/blog/2026-01-05-coastal-solar-rust-proof-panels-cuddalore", "Material considerations"),
        ("Solar ROI Calculator", "/blog/2026-01-08-solar-roi-calculator-break-even-analysis", "Compare panel ROI"),
        ("PM Surya Ghar Guide", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "DCR panel requirements")
    ],
    "2026-01-08-solar-roi-calculator-break-even-analysis.md": [
        ("PM Surya Ghar Subsidy", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "Reduce initial investment"),
        ("Solar EMI Loans", "/blog/2026-01-03-solar-emi-loans-tamil-nadu-2026", "Financing options"),
        ("Understanding TNEB Bill", "/blog/2026-01-17-understanding-tneb-solar-bill", "Calculate savings accurately")
    ],
    "2026-01-09-solar-scam-warnings-cuddalore.md": [
        ("PM Surya Ghar Process", "/blog/2026-01-01-pm-surya-ghar-scheme-cuddalore-2026", "Official subsidy route"),
        ("DC Cable Quality Check", "/blog/2026-01-14-solar-dc-cable-quality-guide", "Verify installation quality"),
        ("Earthing Standards", "/blog/2026-01-13-solar-earthing-safety-guide", "Safety compliance")
    ],
    "2026-01-11-future-of-solar-tamil-nadu-trends.md": [
        ("Current Technology", "/blog/2026-01-07-mono-vs-bifacial-solar-panels", "Today's best options"),
        ("Hybrid Systems", "/blog/2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu", "Latest inverter tech"),
        ("Commercial Solar", "/blog/2026-01-19-commercial-solar-tax-benefits", "Business opportunities")
    ]
}

# CTA boxes for blogs missing them
missing_ctas = {
    "2026-01-05-coastal-solar-rust-proof-panels-cuddalore.md": {
        "title": "Living in Coastal Cuddalore?",
        "text": "Get a specialized coastal solar consultation. We'll inspect your location and recommend IEC 61701 certified components.",
        "buttons": "**[Book Coastal Assessment](/contact)** | **[Check Requirements](/cost-calculator)**",
        "insert_before": "## FAQ"
    },
    "2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu.md": {
        "title": "Not Sure Which System Type?",
        "text": "Get a free grid quality test and system recommendation based on your power backup needs and budget.",
        "buttons": "**[Test My Grid](/contact)** | **[Compare Systems](/cost-calculator)**",
        "insert_before": "## FAQ"
    },
    "2026-01-07-mono-vs-bifacial-solar-panels.md": {
        "title": "Confused About Panel Technology?",
        "text": "Our experts will recommend the optimal panel type based on your roof conditions, budget, and generation goals.",
        "buttons": "**[Get Panel Recommendation](/contact)** | **[Calculate Savings](/cost-calculator)**",
        "insert_before": "## FAQ"
    },
    "2026-01-08-solar-roi-calculator-break-even-analysis.md": {
        "title": "Want Personalized ROI Analysis?",
        "text": "Get a detailed financial breakdown customized to your consumption pattern, roof size, and financing options.",
        "buttons": "**[Get ROI Report](/contact)** | **[Use Calculator](/cost-calculator)**",
        "insert_before": "## FAQ"
    },
    "2026-01-09-solar-scam-warnings-cuddalore.md": {
        "title": " Worried About Solar Scams?",
        "text": "Get a free quote verification service. Send us any quote and we'll tell you if it's genuine or has red flags.",
        "buttons": "**[Verify Quote](/contact)** | **[Get Trusted Quote](/cost-calculator)**",
        "insert_before": "## FAQ"
    },
    "2026-01-11-future-of-solar-tamil-nadu-trends.md": {
        "title": "Ready for Future-Proof Solar?",
        "text": "Get a system designed with upgrade paths for batteries, EV charging, and future expansions built in.",
        "buttons": "**[Plan My System](/contact)** | **[Explore Options](/cost-calculator)**",
        "insert_before": "## FAQ"
    }
}

def remove_emojis(text):
    """Remove ALL emojis from text"""
    # Comprehensive emoji pattern
    emoji_pattern = re.compile(
        "["
        "\U0001F1E0-\U0001F1FF"  # flags
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F680-\U0001F6FF"  # transport & map
        "\U0001F700-\U0001F77F"  # alchemical
        "\U0001F780-\U0001F7FF"  # Geometric Shapes
        "\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
        "\U0001F900-\U0001F9FF"  # Supplemental Symbols
        "\U0001FA00-\U0001FA6F"  # Chess Symbols
        "\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
        "\U00002702-\U000027B0"  # Dingbats
        "\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub('', text)

def fix_double_lines(text):
    """Remove double horizontal dividers"""
    # Fix ---\n---
    text = re.sub(r'---\r?\n\r?\n---', '---', text)
    # Fix triple dividers
    text = re.sub(r'---\r?\n---\r?\n---', '---', text)
    return text

def add_faq_section(content, filename):
    """Add FAQ section if missing"""
    if filename in missing_faqs and "## FAQ" not in content:
        # Find insertion point (before Related Articles or before CONTACT_CTA)
        if "## Related Articles" in content:
            content = content.replace("## Related Articles", missing_faqs[filename] + "\n\n---\n\n## Related Articles")
        elif "<!-- COMPONENT: CONTACT_CTA -->" in content:
            content = content.replace("<!-- COMPONENT: CONTACT_CTA -->", missing_faqs[filename] + "\n\n<!-- COMPONENT: CONTACT_CTA -->")
    return content

def add_related_articles(content, filename):
    """Add Related Articles section if missing"""
    if filename in missing_related and "## Related Articles" not in content:
        related_section = "\n## Related Articles\n\n"
        for title, link, desc in missing_related[filename]:
            related_section += f"- **[{title}]({link})** - {desc}\n"
        related_section += "\n"
        
        # Insert before CONTACT_CTA
        if "<!-- COMPONENT: CONTACT_CTA -->" in content:
            content = content.replace("<!-- COMPONENT: CONTACT_CTA -->", related_section + "<!-- COMPONENT: CONTACT_CTA -->")
    return content

def add_cta_box(content, filename):
    """Add professional CTA box if missing"""
    if filename in missing_ctas and "> **" not in content:
        cta_config = missing_ctas[filename]
        cta_box = f"""---

> **{cta_config['title']}**
> 
> {cta_config['text']}
> 
> {cta_config['buttons']}

---

"""
        # Insert before FAQ section
        insert_before = cta_config['insert_before']
        if insert_before in content:
            content = content.replace(insert_before, cta_box + insert_before)
    return content

def process_blog(filepath):
    """Process single blog file"""
    filename = filepath.name
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    changes = []
    
    # 1. Remove emojis
    new_content = remove_emojis(content)
    if new_content != content:
        changes.append("Removed emojis")
        content = new_content
    
    # 2. Fix double lines
    new_content = fix_double_lines(content)
    if new_content != content:
        changes.append("Fixed double lines")
        content = new_content
    
    # 3. Add FAQ if missing
    new_content = add_faq_section(content, filename)
    if new_content != content:
        changes.append("Added FAQ section")
        content = new_content
    
    # 4. Add Related Articles if missing
    new_content = add_related_articles(content, filename)
    if new_content != content:
        changes.append("Added Related Articles")
        content = new_content
    
    # 5. Add CTA box if missing
    new_content = add_cta_box(content, filename)
    if new_content != content:
        changes.append("Added CTA box")
        content = new_content
    
    # Save if changes made
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {filename}")
        for change in changes:
            print(f"    - {change}")
        return True
    else:
        print(f"  {filename} - No changes needed")
        return False

# ============================================================================
# MAIN EXECUTION
# ============================================================================
print("=" * 60)
print("COMPREHENSIVE BLOG CLEANUP - Starting...")
print("=" * 60)

files = sorted(blog_dir.glob("2026-*.md"))
total_fixed = 0

for filepath in files:
    if process_blog(filepath):
        total_fixed += 1

print("=" * 60)
print(f"✅ COMPLETE: Fixed {total_fixed}/{len(files)} blogs")
print("=" * 60)
