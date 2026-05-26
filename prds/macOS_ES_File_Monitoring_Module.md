
# macOS EndpointSecurity (ES) File Monitoring Module

## 1. Executive Summary
The objective is to build a high-performance file monitoring module for macOS that integrates with the **EndpointSecurity Framework**. This module provides real-time visibility into filesystem operations to detect malicious behavior.

## 2. Goals & Objectives
* **Goal:** Implement an `es_client_t` listener to monitor file-related events (`ES_EVENT_TYPE_NOTIFY_OPEN`, `ES_EVENT_TYPE_NOTIFY_WRITE`, `ES_EVENT_TYPE_NOTIFY_RENAME`, `ES_EVENT_TYPE_NOTIFY_UNLINK`).
* **KPI:** Latency < 20ms per event.
* **KPI:** Native operation within Apple's "System Extensions" sandbox.

## 3. Functional Requirements
| ID | Feature | Description |
| :--- | :--- | :--- |
| FR-01 | ES Client Initialization | Create and authenticate `es_client_t` with appropriate developer entitlements. |
| FR-02 | Event Subscription | Subscribe to granular `AUTH` and `NOTIFY` events. |
| FR-03 | Context Resolution | Resolve `es_event_path_t` and map to `audit_token_t` (PID/UID). |
| FR-04 | Async Communication | Pass event data to Agent Service via non-blocking queue. |
| FR-05 | Event Filtering | Implement pre-filter to discard known-safe events. |

## 4. Non-Functional Requirements
* **Performance:** ES callbacks must be non-blocking; use asynchronous offloading.
* **Compatibility:** macOS 10.15+; packaged as a System Extension.
* **Reliability:** Implement watchdog for `es_client` connection status.

## 5. Success Metrics
1. **Verification:** Successfully capture file creation in `~/Downloads` and `/Applications`.
2. **Stress Test:** Verify resource stability during high-frequency file operations.
3. **Deployment:** Successful load/unload of System Extension via `sysextd`.
