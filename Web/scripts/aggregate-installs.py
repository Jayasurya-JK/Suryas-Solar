# Monthly refresh: export 'My Applications' from the PM Surya Ghar vendor portal (read-only), then run
#   python -I scripts/aggregate-installs.py "<path to Vendor-My-Applications-List-*.csv>" src/data/installs.json
# and DELETE the export afterwards. Never commit the export: it holds customer names, phones and addresses.
# Reads the PM Surya Ghar vendor export and writes ONLY area-level totals (no personal data).
import csv, glob, json, sys, collections, datetime

src = glob.glob(sys.argv[1])[0]
out = sys.argv[2]
rows = list(csv.DictReader(open(src, encoding='utf-8-sig')))

# Area groups: display name, approx area centre (lat, lng). Never a customer location.
AREAS = {
    'cuddalore': ('Cuddalore Town', 11.748, 79.748),
    'nathapattu': ('Nathapattu', 11.715, 79.735),
    'semmankuppam': ('Semmankuppam', 11.690, 79.745),
    'nellikuppam': ('Nellikuppam', 11.775, 79.672),
    'vadalur': ('Vadalur', 11.555, 79.553),
    'kurinjipadi': ('Kurinjipadi', 11.563, 79.597),
    'srimushnam': ('Srimushnam', 11.402, 79.410),
    'vridhachalam': ('Vridhachalam', 11.518, 79.325),
    'panruti': ('Panruti', 11.776, 79.553),
    'chidambaram': ('Chidambaram', 11.399, 79.693),
    'puducherry': ('Puducherry', 11.935, 79.805),
    'bahour': ('Bahour', 11.805, 79.745),
    'villupuram': ('Villupuram', 11.940, 79.490),
    'kandamangalam': ('Kandamangalam', 11.905, 79.690),
}

def area_key(r):
    sub = r['Sub Division Name'].lower()
    div = r['Division Name'].lower()
    dist = r['District Name'].lower()
    if 'puducherry' in dist:
        return 'bahour' if 'bahour' in sub else 'puducherry'
    for k, needles in [
        ('nathapattu', ['nathapattu']), ('semmankuppam', ['semmankuppam']), ('nellikuppam', ['nellikuppam']),
        ('vadalur', ['vadalur']), ('kurinjipadi', ['kurinjiapdi', 'kurinjipadi']), ('srimushnam', ['srimushnam']),
        ('vridhachalam', ['vridhachalam']), ('panruti', ['panruti']), ('kandamangalam', ['kandamangalam']),
        ('chidambaram', ['chidambaram']),
    ]:
        if any(n in sub or n in div for n in needles):
            return k
    if 'cuddalore' in dist:
        return 'cuddalore'
    if 'viluppuram' in dist or 'villupuram' in dist:
        return 'villupuram'
    return None  # outside our map area

def num(x):
    try:
        return float(str(x).replace(',', '').strip() or 0)
    except ValueError:
        return 0.0

agg = collections.defaultdict(lambda: {'homes': 0, 'kwp': 0.0, 'applications': 0})
installed = [r for r in rows if r['Solar Plant Installation Date'].strip()]
for r in rows:
    k = area_key(r) or 'other'
    agg[k]['applications'] += 1
    if r['Solar Plant Installation Date'].strip():
        agg[k]['homes'] += 1
        agg[k]['kwp'] += num(r['Installed PV Module Capacity (kWp)'])

areas = []
for k, v in sorted(agg.items(), key=lambda kv: -kv[1]['applications']):
    if k == 'other':
        continue
    name, lat, lng = AREAS[k]
    areas.append({'key': k, 'name': name, 'lat': lat, 'lng': lng, 'homes': v['homes'],
                  'kwp': round(v['kwp'], 1), 'applications': v['applications']})

kwp = sum(num(r['Installed PV Module Capacity (kWp)']) for r in installed)
data = {
    'asOf': 'October 2026',
    'source': 'PM Surya Ghar vendor portal export',
    'homesInstalled': len(installed),
    'kwpInstalled': round(kwp, 1),
    'applications': len(rows),
    'subsidyDisbursedRs': int(sum(num(r['Subsidy Amount (Rs.)']) for r in rows if r['Subsidy Disbursed Date'].strip())),
    'subsidyPaidHomes': sum(1 for r in rows if r['Subsidy Disbursed Date'].strip()),
    'loanFamilies': sum(1 for r in rows if r['Loan Taken (Yes/No)'].strip().lower() == 'yes'),
    'outsideMapApplications': agg['other']['applications'] if 'other' in agg else 0,
    'areas': areas,
}
json.dump(data, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(json.dumps({k: v for k, v in data.items() if k != 'areas'}, ensure_ascii=False))
for a in areas:
    print(a['name'], a['homes'], a['kwp'], a['applications'])
