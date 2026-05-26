
# Product Requirements Document (PRD): OCSF-Compliant macOS Log Collector

## 1. Executive Summary
The macOS Log Collector is a specialized daemon designed to capture system telemetry and normalize it into OCSF-compliant JSON objects. By mapping Apple’s proprietary event streams to standard OCSF classes, this module ensures that macOS security data is immediately actionable and interoperable with existing OCSF-aware SIEM/XDR platforms.

## 2. Goals & Objectives
* **Goal:** Adopt OCSF 1.7.0 as the universal telemetry schema.
* **KPI:** 100% of telemetry mapped to official OCSF Category and Class definitions.
* **KPI:** Real-time normalization with < 5ms processing latency per event.

## 3. Functional Requirements
| ID | Feature | OCSF Class Mapping | Description |
| :--- | :--- | :--- | :--- |
| FR-01 | Process Monitoring | Process Activity (1001) | Map `ES_EVENT_TYPE_NOTIFY_EXEC` to OCSF. |
| FR-02 | File Auditing | File Activity (1004) | Map `ES_EVENT_TYPE_NOTIFY_OPEN/WRITE` to OCSF. |
| FR-03 | Network Filtering | Network Activity (4001) | Map `NEFilter` flows to OCSF 5-tuple. |
| FR-04 | System Audits | System Activity (1000) | Map `os_log` to OCSF System activity. |
| FR-05 | Identity Mapping | Authentication (2001) | Normalize macOS login and TCC permission changes. |

## 4. Non-Functional Requirements
* **Schema Evolution:** Support hot-swapping schema mapping definitions.
* **Performance:** Use optimized C++ structures for normalization; CPU usage < 2%.
* **Schema Enforcement:** Payloads must pass local JSON-schema validation before queuing.

## 5. Technical Constraints & Risks
* **Constraint:** macOS Unified Logs variability.
    * *Mitigation:* Implement dynamic "Severity Filter" based on backend instructions.
* **Risk:** Schema Bloat.
    * *Mitigation:* Employ "Selective Field Mapping" to transmit only necessary OCSF fields.

## 6. Success Metrics
1. **Compliance:** 100% of generated JSON events pass OCSF validation.
2. **Efficiency:** < 2% CPU impact at 5,000 events/sec.
3. **Consistency:** Field parity with Windows/Linux OCSF implementations.
