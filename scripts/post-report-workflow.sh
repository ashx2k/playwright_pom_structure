#!/usr/bin/env bash
set -euo pipefail

# Shared post-test report automation for CI and local runs.
# 1) Copy Allure report to reports/<run-folder>
# 2) Delete reports older than 30 days
# 3) Rebuild index page
# 4) Build report URL
# 5) Optionally push to gh-pages (CI)
# 6) Optionally send email

REPORT_SOURCE_DIR="${REPORT_SOURCE_DIR:-artifacts/allure-report}"
REPORTS_ROOT="${REPORTS_ROOT:-reports}"
RUN_ID="${RUN_ID:-$(date +'%Y-%m-%d')-run-${GITHUB_RUN_NUMBER:-local}}"
REPORT_DIR="${REPORTS_ROOT}/${RUN_ID}"

if [[ ! -d "$REPORT_SOURCE_DIR" ]]; then
  echo "Report source not found: $REPORT_SOURCE_DIR"
  exit 1
fi

mkdir -p "$REPORT_DIR"
cp -R "$REPORT_SOURCE_DIR"/. "$REPORT_DIR"/

echo "Copied report to $REPORT_DIR"

./scripts/cleanup-old-reports.sh "$REPORTS_ROOT" 30

{
  echo "<html><head><title>Allure Reports</title></head><body>"
  echo "<h1>Allure Reports</h1><ul>"
  for d in $(ls -1 "$REPORTS_ROOT" | sort -r); do
    echo "<li><a href=\"${d}/index.html\">${d}</a></li>"
  done
  echo "</ul></body></html>"
} > "${REPORTS_ROOT}/index.html"

if [[ -n "${GITHUB_REPOSITORY_OWNER:-}" && -n "${GITHUB_REPOSITORY:-}" ]]; then
  REPO="${GITHUB_REPOSITORY#*/}"
  REPORT_URL="https://${GITHUB_REPOSITORY_OWNER}.github.io/${REPO}/${REPORTS_ROOT}/${RUN_ID}/index.html"
else
  if [[ -n "${LOCAL_REPORT_BASE_URL:-}" ]]; then
    REPORT_URL="${LOCAL_REPORT_BASE_URL%/}/${RUN_ID}/index.html"
  else
    REPORT_URL="file://$(pwd)/${REPORTS_ROOT}/${RUN_ID}/index.html"
  fi
fi

export REPORT_URL
echo "REPORT_URL=${REPORT_URL}" | tee -a "${GITHUB_ENV:-/dev/null}" >/dev/null || true

echo "Report URL: ${REPORT_URL}"

if [[ "${PUSH_GH_PAGES:-false}" == "true" ]]; then
  git add "$REPORTS_ROOT"
  git commit -m "Update report ${RUN_ID}" || echo "No report changes to commit"
  git push origin gh-pages
fi

if [[ "${SEND_EMAIL:-false}" == "true" ]]; then
  ./scripts/send-report-email.py
fi
