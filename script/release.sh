#!/bin/sh
# Release script: bump VERSION, commit (version-only msg), tag, push.
# Version format: YYYY.MM.DD.NN (NN zero-padded, resets each day).
# Usage:
#   Stage your real changes first (git add ...), then run:  sh script/release.sh
# Requires: a clean or staged working tree (no unrelated unstaged changes).

set -e
cd "$(git rev-parse --show-toplevel)"

today=$(date +%Y.%m.%d)

# Find highest sequence for today across tags and commit subjects.
last_tag=$(git tag --list "${today}.*" | awk -F. 'length($NF) && $NF+0==$NF {print $NF+0}' | sort -n | tail -1)
last_log=$(git log --format=%s | grep -E "^${today}\.[0-9]+$" | awk -F. '{print $NF+0}' | sort -n | tail -1)
last=0
[ -n "$last_tag" ] && [ "$last_tag" -gt "$last" ] && last="$last_tag"
[ -n "$last_log" ] && [ "$last_log" -gt "$last" ] && last="$last_log"
next=$(( last + 1 ))
ver=$(printf "%s.%02d" "$today" "$next")

echo "$ver" > VERSION
git add VERSION

# Require something to commit (VERSION change or other staged changes).
if git diff --cached --quiet; then
  echo "release: nothing to commit. Stage your changes first (git add ...)." >&2
  exit 1
fi

git commit -m "$ver"
git tag -a "$ver" -m "$ver"
git push origin HEAD --follow-tags
echo "released $ver"
