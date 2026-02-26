# GitHub Copilot + Codex Configuration Guide for Trading Bot Swarm

## 1) Purpose and scope

This guide standardizes how engineers use GitHub Copilot and Codex in the Trading Bot Swarm ecosystem so that automation is:

- consistent,
- secure by default,
- test-first for behavior changes,
- and production-safe for market-facing systems.

Copilot should be treated as a pair programmer with strict behavioral boundaries, while Codex is used as an implementation accelerator that must obey repository guardrails and quality gates.

## 2) Configuration overview (enterprise baseline)

### Testing and linting policy

- **Code changes:** always run lint + unit tests + impacted integration tests.
- **Docs-only changes:** lint/tests may be skipped if no executable code or configuration changed.
- Require CI status checks before merge.

### Code style and architecture

- Enforce TypeScript strictness and ESLint in CI.
- Use modular boundaries (domain, adapters, orchestration, infra).
- Prefer pure functions for strategy logic and explicit interfaces for exchange adapters.

### Async and concurrency patterns

- Use bounded concurrency for order placement and polling.
- Add timeout + retry policies with jitter for all external API calls.
- Use cancellation primitives for long-running tasks.

### Security defaults

- Never log secrets, raw credentials, or private keys.
- Validate external payloads via schema validation.
- Enforce least-privilege tokens and scoped credentials.
- Add dependency and secret scanning in CI.

### Logging and observability

- Structured logs (JSON) with trace/task IDs.
- Standardize metrics for order latency, fill rate, error rate, and PnL pipeline lag.
- Alert on error bursts, queue growth, stale market data, and retry storms.

### CI/CD integration

- Quality gate workflow: lint, type-check, unit/integration tests.
- Security workflow: dependency audit + secret scan + SAST.
- Release workflow: semantic versioning + signed tags + release notes.

### Version control and branching strategy

- Protected branches: `main` (production), optional `release/*` (stabilization).
- Day-to-day delivery via short-lived `feature/<ticket>-<slug>` branches.
- Require 1–2 reviewers for risk-sensitive areas (execution, risk engine, auth, secrets).
- Squash merge for feature branches; rebase policy optional based on team standards.

## 3) Codex + Copilot custom instruction behavior

### Behavioral rules

- Generate code matching project lint/type constraints.
- For code changes, run tests and linters before proposing merge.
- Ignore mandatory test/lint execution for **documentation-only** edits.
- Refuse unsafe patterns (hardcoded secrets, disabled TLS verification, shell-injection-prone code).
- Prefer deterministic logic and idempotent automation steps.

### Conceptual custom-instructions YAML

```yaml
agents:
    copilot:
        role: "pair_programmer"
        behavior:
            - "Prefer minimal, readable diffs"
            - "Follow repository ESLint + TypeScript strict rules"
            - "Suggest tests for every behavior change"
            - "Never introduce plaintext secrets"
            - "Use safe async patterns with timeout/retry/cancellation"
    codex:
        role: "implementation_accelerator"
        behavior:
            - "Run lint + tests for code changes"
            - "Skip mandatory test execution for docs-only changes"
            - "Preserve public interfaces unless task requires change"
            - "Harden input handling and error paths"
            - "Document migration impact for config/schema changes"

quality_gates:
    code_changes:
        require:
            - lint
            - typecheck
            - unit_tests
            - impacted_integration_tests
    docs_only_changes:
        require:
            - markdown_lint_optional

security_defaults:
    deny:
        - hardcoded_tokens
        - insecure_tls
        - unsanitized_shell_commands
    require:
        - secret_scanning
        - dependency_scanning
        - schema_validation_for_external_input
```

## 4) GitHub workflow example (lint + test automation)

### Trigger conditions

- Pull requests targeting `main`
- Push events on `main`
- Manual dispatch for on-demand verification

### Quality gate job steps

1. Checkout
2. Setup Node
3. Install dependencies (`npm ci`)
4. Lint
5. Type-check
6. Unit tests
7. Integration tests (when required)
8. Upload artifacts/reports

```yaml
name: quality-gate
on:
    pull_request:
        branches: [main]
    push:
        branches: [main]
    workflow_dispatch:

jobs:
    quality-gate:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "20.x"
                  cache: npm
            - run: npm ci
            - run: npm run lint
            - run: npm run check-types
            - run: npm run test
```

## 5) Semantic release and version tagging (best practice)

```yaml
name: semantic-release
on:
    push:
        branches: [main]

jobs:
    release:
        runs-on: ubuntu-latest
        permissions:
            contents: write
            issues: write
            pull-requests: write
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "20.18.1"
            - run: npm ci
            - run: npm run lint && npm run test
            - run: npx semantic-release
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 6) Security and dependency scanning workflow example

```yaml
name: security-and-dependencies
on:
    pull_request:
    push:
        branches: [main]

jobs:
    scan:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "20.18.1"
                  cache: npm
            - run: npm ci
            - run: npm audit --audit-level=high
            - run: npx eslint . --max-warnings=0
            - name: Secret scan
              uses: gitleaks/gitleaks-action@v2
```

## 7) Release-readiness checklist

### Code review

- [ ] Peer review completed for all changed files.
- [ ] High-risk modules reviewed by designated owners.
- [ ] No unresolved review comments.

### Testing

- [ ] Unit tests green.
- [ ] Integration tests green.
- [ ] UAT scenarios validated with expected outcomes.
- [ ] Non-functional checks completed (latency/retry behavior).

### Documentation

- [ ] Architecture/README updated.
- [ ] Deployment and rollback steps documented.
- [ ] Change log/release notes drafted.

### Deployment

- [ ] Deployment window approved.
- [ ] Rollback plan tested and documented.
- [ ] Feature flags configured for progressive rollout.

### Monitoring

- [ ] Dashboards updated.
- [ ] Alerts configured and routed.
- [ ] On-call ownership confirmed for first 24–48h.

## 8) Communication plan for stakeholders

- Publish release timeline (T-7, T-3, T-1, release day, +24h).
- Share scope, risks, mitigations, and rollback criteria.
- Provide support contacts (engineering owner, on-call rotation, incident channel).
- Send post-release status summary with KPI deltas and follow-up actions.

## 9) Contributor workflow

1. Create `feature/<ticket>-<slug>` branch.
2. Implement minimal diff with tests.
3. Run local lint/type/test.
4. Open PR with risk notes and validation evidence.
5. Address review feedback; merge only after required checks pass.

### Review criteria

- Correctness and deterministic behavior
- Security and secrets hygiene
- Observability completeness
- Performance impact and regression risk

### Validation process

- CI quality gate required
- Manual verification for exchange-integration touchpoints
- Sign-off from owner for risk-sensitive modules

## 10) Troubleshooting and optimization tips

- **Flaky tests:** isolate network I/O, use deterministic mocks, add retry budget only for known transient paths.
- **Slow CI:** parallelize jobs, cache deps, run changed-package selection where safe.
- **False-positive security alerts:** triage with explicit suppression records and expiry dates.
- **Runtime latency spikes:** inspect queue depth, external API saturation, and retry cascade metrics.

## 11) Maintenance schedule

- Monthly review of this guide.
- Immediate update on policy or architecture changes.
- Quarterly governance audit against CI/CD and security controls.

---

**Goal:** standardize excellence and strengthen the reliability, performance, and safety of the trading ecosystem.
