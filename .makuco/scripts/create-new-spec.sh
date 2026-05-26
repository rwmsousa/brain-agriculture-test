#!/bin/bash

# create-new-spec.sh
# Creates a new feature spec branch and directory structure
# Usage: ./create-new-spec.sh "Feature description" [--json] [--short-name "short-name"] ["Title"]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SPECS_DIR="$PROJECT_ROOT/.makuco/specs"

FEATURE_DESCRIPTION=""
SHORT_NAME=""
TITLE=""
JSON_MODE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --json)
      JSON_MODE=true
      shift
      ;;
    --short-name)
      SHORT_NAME="$2"
      shift 2
      ;;
    *)
      if [[ -z "$FEATURE_DESCRIPTION" ]]; then
        FEATURE_DESCRIPTION="$1"
      else
        TITLE="$1"
      fi
      shift
      ;;
  esac
done

if [[ -z "$SHORT_NAME" ]]; then
  SHORT_NAME=$(echo "$FEATURE_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | tr ' ' '-' | cut -c1-40)
fi

if [[ -z "$TITLE" ]]; then
  TITLE="$FEATURE_DESCRIPTION"
fi

TIMESTAMP=$(date +%Y%m%d%H%M%S)
BRANCH_NAME="spec/${SHORT_NAME}-${TIMESTAMP}"
FEATURE_DIR="$SPECS_DIR/${SHORT_NAME}-${TIMESTAMP}"
SPEC_FILE="$FEATURE_DIR/spec.md"

# Create directory structure
mkdir -p "$FEATURE_DIR/checklists"

# Create the spec file
cat > "$SPEC_FILE" << SPECEOF
# Feature Specification: $TITLE

> Status: Draft
> Branch: $BRANCH_NAME
> Created: $(date +%Y-%m-%d)

## Description

_To be filled._

## Objectives

_To be filled._

## Stakeholders

_To be filled._

## User Stories

_To be filled._

## Business Rules

_To be filled._

## Functional Requirements

_To be filled._

## Non-Functional Requirements

_To be filled._

## Data Model

_To be filled._

## User Flows

_To be filled._

## Acceptance Criteria

_To be filled._

## Out of Scope

_To be filled._
SPECEOF

# Create requirements checklist
cat > "$FEATURE_DIR/checklists/requirements.md" << CHECKEOF
# Requirements Checklist

Feature: $TITLE
Branch: $BRANCH_NAME
Created: $(date +%Y-%m-%d)

## Validation Items

- [ ] All functional requirements are clearly stated
- [ ] All business rules are documented
- [ ] Acceptance criteria are measurable and technology-agnostic
- [ ] User stories follow "As a [role], I want [goal], so that [benefit]" format
- [ ] Non-functional requirements are specified (performance, security, scalability)
- [ ] Out of scope items are explicitly listed
- [ ] Data model entities and relationships are defined
- [ ] All edge cases and error scenarios are covered
- [ ] Success criteria are verifiable without knowing implementation details
- [ ] No implementation details in the spec (no tech stack, APIs, code structure)
CHECKEOF

# Create git branch
cd "$PROJECT_ROOT"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME" 2>/dev/null

if [[ "$JSON_MODE" == true ]]; then
  cat << JSONEOF
{
  "branch_name": "$BRANCH_NAME",
  "feature_dir": "$FEATURE_DIR",
  "spec_file": "$SPEC_FILE",
  "checklist_file": "$FEATURE_DIR/checklists/requirements.md",
  "short_name": "$SHORT_NAME",
  "title": "$TITLE"
}
JSONEOF
else
  echo "Branch created: $BRANCH_NAME"
  echo "Spec file: $SPEC_FILE"
  echo "Checklist: $FEATURE_DIR/checklists/requirements.md"
fi
