#!/bin/bash
set -e

echo "Running basic checks..."

if [ ! -s index.html ]; then
  echo "index.html is empty"
  exit 1
fi

if grep -n "TODO" index.html; then
  echo "Found TODO markers. Please resolve before deployment."
  exit 1
fi

echo "All basic checks passed."
