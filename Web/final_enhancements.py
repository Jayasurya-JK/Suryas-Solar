# Final batch: Add CTA to blogs 02, 03, 04

import os
import re

blog_dir = r"c:\Website Projects\Suryas-Solar\Web\content\blog"

# Manual additions for the remaining blogs
final_additions = {
    "2026-01-02-is-3kw-solar-enough-for-3bhk-2026.md": {
        "cta_insert_before": "## 6.",
        "cta": """---

> **Confused About the Right System Size?**
> 
> Get a free load analysis for your home. Our engineers will calculate your exact requirement based on your appliances and usage patterns.
> 
> **[Get Free Load Analysis](/contact)** | **[Try Solar Calculator](/cost-calculator)**

---

"""
    },
    "2026-01-03-solar-emi-loans-tamil-nadu-2026.md": {
        "cta_insert_before": "## 6.",
        "cta": """---

> **Need Help With Solar Financing?**
> 
> We partner with leading banks for solar loans. Get instant EMI quotes and pre-approved loan offers with minimal documentation.
> 
> **[Get Loan Quote](/contact)** | **[Check EMI Calculator](/cost-calculator)**

---

"""
    },
    "2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026.md": {
        "cta_insert_before": "## 7.",
        "cta": """---

> **Stuck in TNEB Paperwork?**
> 
> We handle complete TNEB liaisoning, net meter application, and approvals. Get your system connected to the grid hassle-free.
> 
> **[Get Liaisoning Support](/contact)** | **[Check Timeline](/cost-calculator)**

---

"""
    }
}

for filename, config in final_additions.items():
    filepath = os.path.join(blog_dir, filename)
    
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8", errors='ignore') as f:
            content = f.read()
        
        # Insert CTA
        pattern = re.escape(config['cta_insert_before'])
        match = re.search(pattern, content)
        
        if match:
            insert_pos = match.start()
            content = content[:insert_pos] + config['cta'] + content[insert_pos:]
            
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            
            print(f"✓ Enhanced: {filename}")
        else:
            print(f"✗ Pattern not found: {filename}")
    else:
        print(f"✗ File not found: {filename}")

print("\n✅ All blogs enhanced!")
