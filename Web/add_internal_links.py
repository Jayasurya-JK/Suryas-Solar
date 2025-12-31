import os
import re

blog_dir = r"c:\Website Projects\Suryas-Solar\Web\content\blog"
files = [f for f in os.listdir(blog_dir) if f.startswith("2026-") and f.endswith(".md")]

# Map of "Keyword" to "Target Slug"
link_map = {
    "Net Meter": "2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026",
    "Net-Meter": "2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026",
    "ROI": "2026-01-08-solar-roi-calculator-break-even-analysis",
    "Return on Investment": "2026-01-08-solar-roi-calculator-break-even-analysis",
    "Shadow": "2026-01-12-solar-shadow-analysis-guide-cuddalore",
    "Earthing": "2026-01-13-solar-earthing-safety-guide",
    "DC Cable": "2026-01-14-solar-dc-cable-quality-guide",
    "Cables": "2026-01-14-solar-dc-cable-quality-guide",
    "Hybrid Inverter": "2026-01-15-voltage-fluctuation-hybrid-solar.md", # Wait, hybrid blog is 06 or 15? 15 is voltage specific. 06 is generic. I'll use 06 for generic.
    "Hybrid": "2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu", 
    "Enphase": "2026-01-16-enphase-micro-inverter-review",
    "Micro-Inverter": "2026-01-16-enphase-micro-inverter-review",
    "TNEB Bill": "2026-01-17-understanding-tneb-solar-bill",
    "Zero Export": "2026-01-18-zero-export-device-guide",
    "ZED": "2026-01-18-zero-export-device-guide",
    "Tax Benefit": "2026-01-19-commercial-solar-tax-benefits",
    "Accelerated Depreciation": "2026-01-19-commercial-solar-tax-benefits",
    "Resale Value": "2026-01-20-solar-increases-home-resale-value",
    "Maintenance": "2026-01-10-solar-maintenance-guide-cuddalore",
    "Cleaning": "2026-01-10-solar-maintenance-guide-cuddalore",
    "Subsidy": "2026-01-01-pm-surya-ghar-scheme-cuddalore-2026",
    "PM Surya Ghar": "2026-01-01-pm-surya-ghar-scheme-cuddalore-2026",
    "Loan": "2026-01-03-solar-emi-loans-tamil-nadu-2026",
    "EMI": "2026-01-03-solar-emi-loans-tamil-nadu-2026"
}

def inject_link(content, keyword, slug):
    # Prepare link: [Keyword](/blog/slug)
    # Regex to find keyword NOT already inside a link []() or HTML tag <>
    # This is complex, so we'll do a simpler check:
    # Find keyword preceded by space/start and followed by space/punctuation, ensuring it's not followed by ] or )
    
    # Simple strategy: Replace first occurrence of " Keyword " with " [Keyword](/blog/slug) "
    # But only if the file isn't linking to itself!
    
    pattern = re.compile(r'(?<!\[)(?<!/)\b' + re.escape(keyword) + r'\b(?!\])(?!/)', re.IGNORECASE)
    
    # We only want to replace the FIRST occurrence in the text body (after frontmatter)
    parts = content.split("---", 2)
    if len(parts) > 2:
        frontmatter = parts[0] + "---" + parts[1] + "---"
        body = parts[2]
        
        # Check if link already exists
        if f"/blog/{slug}" in body:
            return content # Already linked
            
        match = pattern.search(body)
        if match:
             # Ensure we don't replace if it's a heading? Nah, links in headings are okay but rare.
             # We replace just the first one.
             new_body = body[:match.start()] + f"[{match.group()}](/blog/{slug})" + body[match.end():]
             return frontmatter + new_body
    
    return content

for filename in files:
    filepath = os.path.join(blog_dir, filename)
    with open(filepath, "r", encoding="utf-8", errors='ignore') as f:
        content = f.read()
    
    original_content = content
    current_slug = filename.replace(".md", "")
    
    # Sort keys by length desc to handle "Net Meter" before "Net"
    sorted_keywords = sorted(link_map.keys(), key=len, reverse=True)
    
    links_added = 0
    for keyword in sorted_keywords:
        target_slug = link_map[keyword]
        if target_slug == current_slug:
            continue # Don't self link
            
        # Only add max 3 internal links per post to avoid spamminess
        if links_added >= 4:
            break
            
        new_content = inject_link(content, keyword, target_slug)
        if new_content != content:
            content = new_content
            links_added += 1
            
    if content != original_content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Linked {filename}: Added {links_added} links")

