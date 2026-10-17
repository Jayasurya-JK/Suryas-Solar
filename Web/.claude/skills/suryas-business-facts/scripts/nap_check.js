// Flags phone numbers, emails and pincodes that don't match the official business facts.
// Usage (from Web/): node .claude/skills/suryas-business-facts/scripts/nap_check.js
const fs = require('fs')
const path = require('path')

const OK_PHONES = ['7904369094', '9655989595']
const OK_EMAILS = ['suryassolarenergy@gmail.com']
const OK_PINS = ['607006']
const ROOTS = ['src', 'content', 'public', 'scripts']
const EXT = /\.(jsx?|md|txt|json|xml)$/

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (EXT.test(e.name) && e.name !== 'sitemap.xml') out.push(p)
  }
  return out
}

const problems = []
for (const file of ROOTS.flatMap((r) => walk(r))) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (/placeholder/i.test(line)) return // form example text, not real contact info
    const where = `${file}:${i + 1}`
    for (const m of line.matchAll(/(?:\+?91[\s-]?)?([6-9]\d{4}[\s-]?\d{5})\b/g)) {
      const digits = m[1].replace(/\D/g, '')
      if (!OK_PHONES.includes(digits)) problems.push(`${where}  phone ${m[0].trim()}`)
    }
    for (const m of line.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) {
      if (!OK_EMAILS.includes(m[0].toLowerCase())) problems.push(`${where}  email ${m[0]}`)
    }
    for (const m of line.matchAll(/\b60[5-9]\d{3}\b/g)) {
      if (!OK_PINS.includes(m[0])) problems.push(`${where}  pincode ${m[0]}`)
    }
  })
}

if (problems.length === 0) {
  console.log('NAP check passed: all phones, emails and pincodes match.')
} else {
  console.log(`NAP check found ${problems.length} mismatch(es):`)
  problems.forEach((p) => console.log('  ' + p))
  process.exitCode = 1
}
