import os
import re

def fix_cta_links():
    directory = r"c:\Website Projects\Suryas-Solar\Web\content\blog"
    
    # Files identified by grep
    files_to_check = [
        "2026-01-20-solar-increases-home-resale-value.md",
        "2026-01-11-future-of-solar-tamil-nadu-trends.md",
        "2026-01-09-solar-scam-warnings-cuddalore.md",
        "2026-01-10-solar-maintenance-guide-cuddalore.md",
        "2026-01-16-enphase-micro-inverter-review.md",
        "2026-01-18-zero-export-device-guide.md",
        "2026-01-17-understanding-tneb-solar-bill.md",
        "2026-01-19-commercial-solar-tax-benefits.md",
        "2026-01-15-voltage-fluctuation-hybrid-solar.md",
        "2026-01-13-solar-earthing-safety-guide.md",
        "2026-01-12-solar-shadow-analysis-guide-cuddalore.md",
        "2026-01-07-mono-vs-bifacial-solar-panels.md",
        "2026-01-06-on-grid-vs-hybrid-solar-tamil-nadu.md",
        "2026-01-14-solar-dc-cable-quality-guide.md",
        "2026-01-08-solar-roi-calculator-break-even-analysis.md",
        "2026-01-04-how-to-get-tneb-net-meter-cuddalore-2026.md",
        "2026-01-03-solar-emi-loans-tamil-nadu-2026.md",
        "2026-01-02-is-3kw-solar-enough-for-3bhk-2026.md",
        "2026-01-05-coastal-solar-rust-proof-panels-cuddalore.md",
        "2026-01-01-pm-surya-ghar-scheme-cuddalore-2026.md"
    ]

    for filename in files_to_check:
        filepath = os.path.join(directory, filename)
        if not os.path.exists(filepath):
            print(f"Skipping {filename}: Not found")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regex to find markdown links pointing to /contact and replace with /#booking
        # Pattern: [Link Text](/contact) -> [Link Text](/#booking)
        # Also handles cases with anchors like /contact#something if any, forcing to /#booking
        
        new_content = re.sub(r'\]\(/contact(?:#[^)]*)?\)', '](/#booking)', content)
        
        # Specific fix for "Request a Site Visit for Shadow Analysis" if it was not caught or needs checking
        # The above regex catches `]( /contact )`
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filename}")
        else:
            print(f"No changes: {filename}")

if __name__ == "__main__":
    fix_cta_links()
