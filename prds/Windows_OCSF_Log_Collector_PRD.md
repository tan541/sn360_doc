
# Product Requirements Document (PRD): OCSF-Compliant Windows Log Collector

## 1. Executive Summary
The Windows Log Collector is a high-performance service designed to ingest Windows-specific telemetry and normalize it into OCSF-compliant JSON format. By bridging native Windows event sources (ETW, Security Event Logs) with the Open Cybersecurity Schema Framework, this module provides standardized security data for cross-platform XDR analysis.

## 2. Goals & Objectives
* **Goal:** Adopt OCSF 1.7.0 as the standardized telemetry schema for all Windows events.
* **KPI:** 100% of collected events successfully mapped to OCSF Categories/Classes.
* **KPI:** Normalization latency < 5ms per event.

## 3. Functional Requirements
| ID | Feature | OCSF Class Mapping | Description |
| :--- | :--- | :--- | :--- |
| FR-01 | Process Tracking | Process Activity (1001) | Map ETW `Microsoft-Windows-Kernel-Process` to OCSF. |
| FR-02 | File Monitoring | File Activity (1004) | Map Minifilter and File System audit events to OCSF. |
| FR-03 | Network Events | Network Activity (4001) | Map WFP connection events to OCSF 5-tuple. |
| FR-04 | Authentication | Authentication (2001) | Map Windows Security Event Logs (4624/4625) to OCSF. |
| FR-05 | Registry Auditing | Registry Activity (1005) | Map registry modifications to OCSF Registry class. |
| FR-06 | Event Transport | N/A | Serialize telemetry into OCSF 1.7.0 JSON and transmit to Agent Service via Named Pipes. |

## 4. Non-Functional Requirements
* **Schema Evolution:** Support for dynamic schema mapping updates via remote policy push.
* **Performance:** Utilize optimized Windows APIs (e.g., `EventLogReader` or ETW `TraceLogging`) to minimize CPU usage.
* **Schema Enforcement:** Payloads must pass local validation against OCSF JSON schemas.

## 5. Technical Constraints & Risks
* **Constraint:** Windows Event logs can be extremely verbose.
    * *Mitigation:* Implement client-side filtering to drop non-security critical noise.
* **Risk:** Schema Bloat.
    * *Mitigation:* Adopt "Selective Field Mapping" based on active detection policy.

## 6. Success Metrics
1. **Compliance:** 100% of output events pass OCSF validation.
2. **Efficiency:** < 2% CPU impact at 5,000 events/sec.
3. **Consistency:** Ensure field parity with Linux/macOS OCSF implementations.
