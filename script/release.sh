#!/bin/sh
# Release script: bump VERSION, commit (version-only msg), tag, push.
# Version format: MAJOR.MINOR.PATCH. Default behavior bumps the patch level.
# Usage:
#   Stage your real changes first (git add ...), then run:  sh script/release.sh
#   Or pass a specific version explicitly: sh script/release.sh 1.0.3
# Requires: a clean or staged working tree (no unrelated unstaged changes).

set -e
cd "$(git rev-parse --show-toplevel)"

normalize_version() {
  ver="$1"
  if ! printf '%s' "$ver" | grep -qE '^[0-9]+(\.[0-9]+){1,2}$'; then
    return 1
  fi
  if [ "$(printf '%s' "$ver" | awk -F. '{print NF}')" -eq 2 ]; then
    ver="$ver.0"
  fi
  printf '%s' "$ver"
}

read_version() {
  if [ -f VERSION ]; then
    cat VERSION
  else
    echo "0.0.0"
  fi
}

current=$(read_version)
if [ "$#" -gt 0 ]; then
  ver=$(normalize_version "$1") || {
    echo "release: invalid version format, expected MAJOR.MINOR.PATCH" >&2
    exit 1
  }
else
  current=$(normalize_version "$current") || {
    echo "release: invalid current VERSION file: $current" >&2
    exit 1
  }
  major=$(printf '%s' "$current" | awk -F. '{print $1}')
  minor=$(printf '%s' "$current" | awk -F. '{print $2}')
  patch=$(printf '%s' "$current" | awk -F. '{print $3}')
  patch=$(( patch + 1 ))
  ver="$major.$minor.$patch"
fi

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
