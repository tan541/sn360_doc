
# Product Requirements Document (PRD): Early Launch Anti-Malware (ELAM) Equivalent for macOS

## 1. Executive Summary
macOS does not have an exact 1:1 architectural equivalent to Windows ELAM. However, security requirements for "Early Launch" functionality are fulfilled through **System Extensions (EndpointSecurity)** and **Kernel Extensions (KEXTs)** in conjunction with **macOS Boot Policy**. This PRD defines the requirements for a high-priority security module that ensures our EDR agent is initialized at the earliest possible stage of the boot process to prevent malicious drivers or processes from establishing persistence.

## 2. Goals & Objectives
* **Goal:** Ensure the EDR agent is active before any third-party user-space application execution.
* **KPI:** Agent initialization achieved during the `Early System Initialization` phase.
* **KPI:** 100% block rate for unauthorized unsigned binaries attempting to execute during boot.

## 3. Functional Requirements

| ID | Feature | Description |
| :--- | :--- | :--- |
| FR-01 | System Extension Loading | Implement as a `SystemExtension` to load during the kernel's initial stages. |
| FR-02 | Boot Policy Enforcement | Register with the `EndpointSecurity` framework to receive `ES_EVENT_TYPE_NOTIFY_EXEC` immediately upon daemon startup. |
| FR-03 | Code-Sign Integrity | Verify the `cdhash` of every process executing at boot against a pre-authorized Apple-signed list. |
| FR-04 | Blocking Capability | Intercept unauthorized execution attempts using `ES_EVENT_TYPE_AUTH_EXEC`. |
| FR-05 | Event Transport | Stream boot-time security events to the Agent Service via `xpc` (Cross-Process Communication). |

## 4. Non-Functional Requirements
* **Performance:** Minimal memory footprint; module must stay resident in kernel-memory space once loaded.
* **Compatibility:** Requires macOS 11.0+ and Apple Silicon (ARM64) boot security enforcement.
* **Reliability:** Must handle system crashes gracefully; the module should not block critical OS boot processes (OS-critical binaries must be inherently trusted).

## 5. Technical Constraints & Risks
* **Constraint:** **Sandbox Restrictions:** System Extensions run within a restricted sandbox.
    * *Mitigation:* Request specific entitlements (`com.apple.developer.endpoint-security.client`).
* **Risk:** **Boot Hangs:** Misconfiguring the EndpointSecurity framework at boot can cause a system-wide hang.
    * *Mitigation:* Implement a "failsafe" boot mode that allows standard OS execution if the agent fails to initialize within a set timeout.

## 6. Success Metrics
1. **Verification:** Confirm agent processes start before any user-space login items.
2. **Detection:** Successfully block a test signed/unsigned binary injected into the Startup folder/LaunchAgents.
3. **Resilience:** Validate that the agent correctly recovers after a non-graceful system shutdown.
