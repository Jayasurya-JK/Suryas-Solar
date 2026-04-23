import csv
import os

folder = r"c:\Website Projects\Suryas-Solar\Google_performance_report\suryassolar.com-Performance-on-Search-2026-03-21"
out_file = r"C:\Users\jksur\.gemini\antigravity\brain\1dd80d63-469d-4081-b484-69d438de0920\performance_summary.md"

def get_table(filename, num=10):
    path = os.path.join(folder, filename)
    if not os.path.exists(path):
        return ""
    
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        try: headers = next(reader)
        except: return ""
        
        md = f"| {' | '.join(headers)} |\n"
        md += f"|{'|'.join(['---']*len(headers))}|\n"
        
        rows = list(reader)
        try: rows.sort(key=lambda x: float(x[1]) if len(x)>1 and x[1].replace('.','').isdigit() else 0, reverse=True)
        except: pass
        
        for row in rows[:num]:
            md += f"| {' | '.join(row)} |\n"
        return md

with open(out_file, "w", encoding='utf-8') as f:
    f.write("# Google Search Console Performance Summary\n\n")
    f.write("Based on the data you exported manually, here are your top metrics for the period:\n\n")
    
    f.write("## 🏆 Top 10 Pages by Clicks\n")
    f.write(get_table("Pages.csv", 10) + "\n\n")
    
    f.write("## 🔍 Top 15 Search Queries\n")
    f.write(get_table("Queries.csv", 15) + "\n\n")
    
    f.write("## 📱 Devices Used\n")
    f.write(get_table("Devices.csv", 3) + "\n\n")

print("Created artifact!")
