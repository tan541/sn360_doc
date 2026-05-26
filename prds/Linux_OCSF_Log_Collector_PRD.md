# Product Requirements Document (PRD): OCSF-Compliant Linux Log Collector

## 1. Executive Summary
The Linux Log Collector is a high-performance daemon designed to ingest native system telemetry (auditd, journald, eBPF logs) and normalize them into OCSF-compliant JSON format. By bridging native Linux event sources with the Open Cybersecurity Schema Framework, this module provides standardized security data for cross-platform XDR analysis.

## 2. Goals & Objectives
* **Goal:** Adopt OCSF 1.7.0 as the standardized telemetry schema for all Linux events.
* **KPI:** 100% of collected events successfully mapped to OCSF Categories/Classes.
* **KPI:** Normalization latency < 5ms per event.

## 3. Functional Requirements
| ID | Feature | OCSF Class Mapping | Description |
| :--- | :--- | :--- | :--- |
| FR-01 | Process Tracking | Process Activity (1001) | Map `auditd` syscall events to OCSF. |
| FR-02 | File Monitoring | File Activity (1004) | Map eBPF/auditd file events to OCSF. |
| FR-03 | Network Events | Network Activity (4001) | Map eBPF flow events to OCSF 5-tuple. |
| FR-04 | Authentication | Authentication (2001) | Map PAM/journald login events to OCSF. |
| FR-05 | System Events | System Activity (1000) | Map kernel messages and service events to OCSF. |
| FR-06 | Event Transport | N/A | Serialize telemetry into OCSF 1.7.0 JSON and transmit to Agent Service via Unix Domain Sockets. |

## 4. Non-Functional Requirements
* **Schema Evolution:** Support for dynamic schema mapping updates via remote policy push.
* **Performance:** Utilize optimized Linux APIs (e.g., `libaudit`, `epoll`) to minimize CPU usage.
* **Schema Enforcement:** Payloads must pass local validation against OCSF JSON schemas.

## 5. Technical Constraints & Risks
* **Constraint:** Auditd can be highly verbose and impact I/O.
    * *Mitigation:* Implement client-side filtering and rate limiting.
* **Risk:** Schema Bloat.
    * *Mitigation:* Adopt "Selective Field Mapping" based on active detection policy.

## 6. Success Metrics
1. **Compliance:** 100% of output events pass OCSF validation.
2. **Efficiency:** < 2% CPU impact at 5,000 events/sec.
3. **Consistency:** Ensure field parity with Windows/macOS OCSF implementations.
