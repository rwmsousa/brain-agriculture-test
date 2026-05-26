#!/bin/bash

# create-new-prompt.sh
# Creates a new implementation prompt file from a spec
# Usage: ./create-new-prompt.sh "spec_file_path" [--json]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

SPEC_FILE=""
JSON_MODE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      JSON_MODE=true
      shift
      ;;
    *)
      SPEC_FILE="$1"
      shift
      ;;
  esac
done

if [[ -z "$SPEC_FILE" ]]; then
  echo "Error: spec file path required" >&2
  exit 1
fi

SPEC_DIR="$(dirname "$SPEC_FILE")"
PROMPT_FILE="$SPEC_DIR/prompt.md"

cat > "$PROMPT_FILE" << PROMPTEOF
# Implementation Plan

> Spec: $SPEC_FILE
> Created: $(date +%Y-%m-%d)

## Overview

_To be filled by makuco-prompt agent._

## Architecture Decisions

_To be filled._

## Implementation Steps

_To be filled._

## File Structure

_To be filled._

## Testing Strategy

_To be filled._
PROMPTEOF

if [[ "$JSON_MODE" == true ]]; then
  cat << JSONEOF
{
  "prompt_file": "$PROMPT_FILE",
  "spec_file": "$SPEC_FILE"
}
JSONEOF
else
  echo "Prompt file: $PROMPT_FILE"
fi
