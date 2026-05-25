# EDR Workflow & Telemetry Ingestion Visualizer

This is a React-based interactive dashboard built to visualize Endpoint Detection and Response (EDR) workflows. It features a premium, responsive cybersecurity dashboard layout utilizing ReactFlow, detailed walkthrough guides, and real-time animated flow vectors.

---

## 🌟 Visual & Interactive Features

### 1. Interactive Triple-Tab Dashboard
*   **Tab 1: Endpoint Agent State**: Follows the lifecycle of the host agent from initial registration to keepalive heartbeat communication, disconnect timeouts, and self-healing network restore transitions.
*   **Tab 2: Log Collector Modules Dataflow**: Demonstrates the telemetry pipelines. Tracks how raw host activities (Processes, File systems, Network sockets, Registry configurations) are captured at kernel levels, sorted by demultiplexing daemon threads, consolidated in event buffers, scanned by threat heuristics, and streamed securely to Cloud SIEM consoles.
*   **Tab 3: Attack Vectors on Kubernetes**: Details cloud cluster vulnerabilities. Traces RCE injections traversing WAF protections, backdoored container image pulls, and credential theft at control planes—all converging inside a compromised container pod, before demonstrating post-exploitation reverse shells and lateral breakouts onto virtual Host Nodes.

### 2. Detailed Technical Walkthrough Sidebar
As you progress through each step, the walkthrough sidebar updates automatically, delivering:
*   **Functional Stage Summaries**: High-level explanation of the current phase.
*   **Under the Hood (Telemetry Mechanics)**: Deep-dive operational details (e.g. eBPF hooking, memory-mapped spools, client certificate pinning).
*   **Technology Pillars**: Visual indicator pills tracking specific frameworks (e.g., eBPF, TLS 1.3, mTLS, MITRE ATT&CK mapping).

### 3. Cyber Dark Aesthetics
*   **Glassmorphism**: Translucent nav tabs and details modules leveraging CSS blur filters.
*   **Active Stream Vectors**: High-voltage, glowing dashed connection streams that flow continuously using keyframe offset animations.
*   **Status Indicators**: Node panels styled dynamically with designated security status glows (emerald for active, amber for pending, rose for disconnected, fuchsia for threat logic).

### 4. Progress Stepper Controls
*   **Navigation Controls**: Bottom panel housing Next Step, Previous Step, and Reset Flow buttons that act seamlessly upon the active workspace.
*   **Step dot Stepper**: Sleek LED-style dot array tracking your current progress phase dynamically.

---

## 🛠️ Requirements

*   **Node.js**: Version 20 or higher.
*   **NPM**: Version 10 or higher.

---

## 🚀 Getting Started

### 1. Install Dependencies
Initialize dependencies and install ReactFlow libraries:
```bash
npm install
```

### 2. Run the Development Server
Launch the local Vite server:
```bash
npm run dev
```
Open the local URL displayed in the terminal (default: `http://localhost:5173/`).

### 3. Stop the App
To terminate the local dev server, press `Ctrl + C` in your terminal shell.

### 4. Create Production Build
Build a fully optimized static distribution folder:
```bash
npm run build
```
