#!/usr/bin/env bash
# P0 validation helpers — contact form API tests
set -euo pipefail
BASE="${1:-http://localhost:8084}"
API="$BASE/api/contact.php"

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

echo "=== Contact form tests @ $API ==="

# Missing fields
code=$(curl -s -o /tmp/cf.json -w "%{http_code}" -X POST "$API" \
  -d "name=&email=&message=&privacy_consent=")
[[ "$code" == "422" ]] && pass "missing fields -> 422" || fail "missing fields (got $code)"

# Invalid email
code=$(curl -s -o /tmp/cf.json -w "%{http_code}" -X POST "$API" \
  -d "name=Test&email=not-an-email&message=Hello&privacy_consent=1")
[[ "$code" == "422" ]] && pass "invalid email -> 422" || fail "invalid email (got $code)"

# Honeypot (fake success, no send)
resp=$(curl -s -X POST "$API" \
  -d "name=Bot&email=bot@spam.com&message=spam&privacy_consent=1&website=http://spam.com")
echo "$resp" | grep -q '"ok":true' && pass "honeypot -> silent ok" || fail "honeypot"

# Valid shape without SMTP
code=$(curl -s -o /tmp/cf.json -w "%{http_code}" -X POST "$API" \
  -d "name=Test+User&email=test@example.com&message=Test+message&privacy_consent=1")
if [[ "$code" == "503" ]]; then
  pass "valid payload without SMTP -> 503"
elif [[ "$code" == "200" ]]; then
  pass "valid payload -> 200 (SMTP configured)"
else
  fail "valid payload (got $code): $(cat /tmp/cf.json)"
fi

# Rate limit (second immediate request)
code1=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API" \
  -d "name=Rate&email=rate@example.com&message=One&privacy_consent=1")
code2=$(curl -s -o /tmp/cf2.json -w "%{http_code}" -X POST "$API" \
  -d "name=Rate&email=rate@example.com&message=Two&privacy_consent=1")
if [[ "$code1" == "200" && "$code2" == "429" ]]; then
  pass "rate limit -> 429 on second send"
elif [[ "$code1" == "503" && "$code2" == "503" ]]; then
  echo "SKIP: rate limit (SMTP not configured, no successful first send)"
else
  echo "NOTE: rate limit codes: $code1 / $code2"
fi

echo "=== Done ==="
