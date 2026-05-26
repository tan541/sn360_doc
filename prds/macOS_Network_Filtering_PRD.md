
# Product Requirements Document (PRD): macOS Network Filtering Module

## 1. Executive Summary
The macOS Network Filtering Module leverages Apple's NetworkExtension (NE) framework to monitor, intercept, and potentially block network traffic. This module provides application-layer visibility, enabling the detection of malicious C2 (Command & Control) callbacks, data exfiltration, and unauthorized network connections.

## 2. Goals & Objectives
* **Goal:** Implement an `NEFilterDataProvider` to inspect network flows in real-time.
* **KPI:** Latency for flow evaluation < 10ms.
* **KPI:** Ensure stability as a background System Extension.

## 3. Functional Requirements
| ID | Feature | Description |
| :--- | :--- | :--- |
| FR-01 | Filter Configuration | Deploy `NEFilterManager` to intercept system-wide TCP/UDP traffic. |
| FR-02 | Socket Inspection | Use `handleNewFlow` to examine connection metadata before establishment. |
| FR-03 | Context Enrichment | Retrieve `audit_token_t` to identify PID and signing identity of the originating process. |
| FR-04 | Async Policy Check | Pass connection metadata to Agent Service for policy evaluation. |
| FR-05 | Dynamic Blocking | Return `NEFilterNewFlowVerdict.drop()` to terminate malicious connections. |

## 4. Non-Functional Requirements
* **Performance:** Use non-blocking evaluation to avoid system-wide network hangs.
* **Compatibility:** macOS 11.0 (Big Sur) or newer.
* **Security:** Must be bundled as a sandboxed System Extension with required network entitlements.

## 5. Technical Constraints & Risks
* **Constraint:** System Extensions have limited packet modification capability compared to legacy KEXTs.
* **Risk:** High traffic volume overloading the filter provider.
    * *Mitigation:* Implement caching for "Known Good" destinations.

## 6. Success Metrics
1. **Verification:** Successfully block a test connection to a blacklisted IP address.
2. **Telemetry:** Ensure every blocked connection includes process path, hash, and destination metadata.
3. **Stability:** Zero kernel panics or performance hangs during network stress tests.
