#!/usr/bin/env bash
set -euo pipefail

REPORTS_DIR="${1:-reports}"
DAYS="${2:-30}"

if [[ ! -d "$REPORTS_DIR" ]]; then
  echo "No reports directory found at: $REPORTS_DIR"
  exit 0
fi

# Delete report folders older than N days.
find "$REPORTS_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +"$DAYS" -print -exec rm -rf {} +

echo "Cleanup completed for reports older than $DAYS days in $REPORTS_DIR"
