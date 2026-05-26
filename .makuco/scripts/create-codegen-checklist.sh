#!/bin/bash

# create-codegen-checklist.sh
# Creates a codegen checklist from a prompt file
# Usage: ./create-codegen-checklist.sh "prompt_file_path" [--json]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

PROMPT_FILE=""
JSON_MODE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      JSON_MODE=true
      shift
      ;;
    *)
      PROMPT_FILE="$1"
      shift
      ;;
  esac
done

if [[ -z "$PROMPT_FILE" ]]; then
  echo "Error: prompt file path required" >&2
  exit 1
fi

PROMPT_DIR="$(dirname "$PROMPT_FILE")"
CHECKLIST_FILE="$PROMPT_DIR/checklists/codegen.md"
mkdir -p "$PROMPT_DIR/checklists"

cat > "$CHECKLIST_FILE" << CHECKEOF
# Codegen Checklist

Created: $(date +%Y-%m-%d)

## Pre-Generation

- [ ] Spec reviewed and understood
- [ ] Architecture decisions documented
- [ ] All dependencies identified

## Implementation

- [ ] All functional requirements implemented
- [ ] All business rules enforced
- [ ] Error handling implemented
- [ ] Input validation in place

## Quality

- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Code follows project conventions
- [ ] No linting errors
- [ ] Documentation updated

## Post-Generation

- [ ] All acceptance criteria verified
- [ ] Docker setup working
- [ ] README updated
CHECKEOF

if [[ "$JSON_MODE" == true ]]; then
  cat << JSONEOF
{
  "checklist_file": "$CHECKLIST_FILE",
  "prompt_file": "$PROMPT_FILE"
}
JSONEOF
else
  echo "Checklist file: $CHECKLIST_FILE"
fi
