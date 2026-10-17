#!/usr/bin/env bash
# Live redirect + canonical check for www.suryassolar.com
# Usage: bash .claude/skills/seo-health-check/scripts/live_check.sh [max_urls]
SITE="https://www.suryassolar.com"
MAX="${1:-200}"

echo "== Host variants (expect one permanent hop to $SITE/)"
for u in http://suryassolar.com/ https://suryassolar.com/ http://www.suryassolar.com/ "$SITE/"; do
  read -r code loc < <(curl -s -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' "$u")
  case "$code" in
    200) verdict="OK" ;;
    301|308) [ "$loc" = "$SITE/" ] && verdict="OK (permanent)" || verdict="CHECK: goes to $loc" ;;
    302|307) verdict="WARN: temporary redirect - make it 308 in Vercel domain settings" ;;
    *) verdict="FAIL" ;;
  esac
  printf '%-32s %s %-36s %s\n' "$u" "$code" "$loc" "$verdict"
done

echo
echo "== Sitemap URLs (status, canonical, title)"
urls=$(curl -s -m 20 "$SITE/sitemap.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | head -n "$MAX")
total=0; bad=0
for u in $urls; do
  total=$((total+1))
  html=$(curl -s -m 20 -w '\n%{http_code}' "$u")
  code=$(printf '%s' "$html" | tail -n1)
  canon=$(printf '%s' "$html" | grep -oE '<link rel="canonical" href="[^"]+"' | head -1 | sed -E 's/.*href="([^"]+)"/\1/')
  title=$(printf '%s' "$html" | grep -oE '<title>[^<]*</title>' | head -1 | sed -E 's#</?title>##g')
  issues=""
  [ "$code" != "200" ] && issues="$issues status=$code"
  [ "$canon" != "$u" ] && issues="$issues canonical=${canon:-MISSING}"
  [ -z "$title" ] && issues="$issues no-title"
  [ ${#title} -gt 65 ] && issues="$issues title-len=${#title}"
  if [ -n "$issues" ]; then bad=$((bad+1)); echo "ISSUE $u ->$issues"; fi
done
echo
echo "Checked $total sitemap URLs, $bad with issues."
