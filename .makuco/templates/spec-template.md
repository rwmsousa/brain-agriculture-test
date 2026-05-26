# Feature Specification: {{FEATURE_TITLE}}

> Status: Draft | Review | Approved
> Branch: {{BRANCH_NAME}}
> Created: {{DATE}}
> Author: {{AUTHOR}}

---

## 1. Overview

### 1.1 Description

{{Brief description of the feature and its purpose.}}

### 1.2 Objectives

{{What are the goals this feature achieves? What problems does it solve?}}

### 1.3 Stakeholders

| Role | Name/Team | Interest |
|------|-----------|----------|
| Product Owner | | Approves requirements |
| Developer | | Implements |
| End User | | Uses the feature |

---

## 2. Context & Background

{{Why is this feature needed? What is the current situation and what will change?}}

---

## 3. User Stories

### Story 1: {{Story Title}}

**As a** {{role}},
**I want** {{goal}},
**So that** {{benefit}}.

**Acceptance Criteria:**
- Given {{context}}, when {{action}}, then {{outcome}}.

---

## 4. Functional Requirements

### FR-01: {{Requirement Title}}

**Description:** {{What the system must do.}}
**Priority:** High | Medium | Low
**User Story:** Story X

### FR-02: {{Requirement Title}}

...

---

## 5. Business Rules

### BR-01: {{Rule Title}}

{{Description of the business rule that must always be enforced.}}

### BR-02: {{Rule Title}}

...

---

## 6. Non-Functional Requirements

### Performance
- {{e.g., "The system must support N concurrent users."}}

### Security
- {{e.g., "All data transmissions must be encrypted."}}

### Usability
- {{e.g., "Users must be able to complete the primary workflow in under 3 minutes."}}

### Availability
- {{e.g., "The system must be available 99.9% of the time."}}

---

## 7. Data Model

### Entities

#### {{Entity Name}}

| Attribute | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| id | UUID | Unique identifier | PK, required |
| ... | ... | ... | ... |

### Relationships

- {{Entity A}} has 0..N {{Entity B}}
- {{Entity B}} belongs to exactly 1 {{Entity A}}

---

## 8. User Flows

### Flow 1: {{Flow Title}}

1. User {{action}}
2. System {{response}}
3. User {{next action}}
4. System {{final response}}

**Alternative Flow (Error):**
1. User submits invalid data
2. System displays validation message
3. User corrects and resubmits

---

## 9. Dashboard & Reporting

{{If applicable, describe what data visualizations or reports are needed.}}

---

## 10. Acceptance Criteria

### AC-01: {{Criterion Title}}

- [ ] {{Measurable, verifiable condition}}
- [ ] {{Another condition}}

### AC-02: {{Criterion Title}}

- [ ] {{Condition}}

---

## 11. Out of Scope

The following items are explicitly NOT included in this feature:

- {{Item 1}}
- {{Item 2}}

---

## 12. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | {{Question?}} | | Open |

---

## 13. Glossary

| Term | Definition |
|------|------------|
| {{Term}} | {{Definition}} |
