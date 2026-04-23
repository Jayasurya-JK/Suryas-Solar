import csv
import os

folder = r"c:\Website Projects\Suryas-Solar\Google_performance_report\suryassolar.com-Performance-on-Search-2026-03-21"

def print_top(filename, title, num=10):
    path = os.path.join(folder, filename)
    if not os.path.exists(path):
        return
    print(f"\n--- {title} ---")
    with open(path, 'r', encoding='utf-16' if 'utf16' in path.lower() else 'utf-8') as f:
        # Sometimes GSC exports are utf-8, sometimes utf-16 with tabs
        reader = csv.reader(f)
        try:
            headers = next(reader)
        except StopIteration:
            return
        
        # Check if it's tab delimited
        if len(headers) == 1 and '\t' in headers[0]:
            f.seek(0)
            reader = csv.reader(f, delimiter='\t')
            headers = next(reader)

        print(" | ".join(headers))
        print("-" * 50)
        
        # Collect rows
        rows = list(reader)
        # Sort by Clicks (usually the second column) if possible
        try:
            # Try to sort, Clicks is typically at index 1
            rows.sort(key=lambda x: float(x[1]) if len(x)>1 and x[1].replace('.','').isdigit() else 0, reverse=True)
        except Exception:
            pass
            
        for i, row in enumerate(rows[:num]):
            print(" | ".join(row))

print_top("Pages.csv", "TOP 10 PAGES BY CLICKS")
print_top("Queries.csv", "TOP 10 QUERIES BY CLICKS")
print_top("Devices.csv", "TOP DEVICES BY CLICKS")
