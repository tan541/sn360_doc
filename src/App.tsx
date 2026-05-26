import { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import type { Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

// ==========================================
// 1. Custom SVG Icons
// ==========================================

const IconNeverConnected = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" x2="6.01" y1="6" y2="6" />
    <line x1="6" x2="6.01" y1="18" y2="18" />
    <path d="m15 6 3 3-3 3" />
    <path d="M18 9H12" />
    <line x1="12" x2="12" y1="6" y2="12" strokeDasharray="2 2" />
  </svg>
);

const IconPending = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" style={{ animation: 'spin 4s linear infinite' }}>
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
);

const IconActive = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconDisconnected = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const IconSource = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconCollector = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="M8 11h6" />
    <path d="M11 8v6" />
  </svg>
);

const IconBuffer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const IconEngine = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const IconShipper = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4Z" />
  </svg>
);

const IconManager = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12h.01" />
    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <path d="M22 13a10.11 10.11 0 0 1-12 10 10.22 10.22 0 0 1-8-10" />
    <path d="M2 13h20M12 12v6" />
  </svg>
);

const IconPDF = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

// --- Hacker Custom Icons for Tab 3 ---

const IconAttacker = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2" />
    <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconRCE = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
);

const IconSupplyChain = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M7.5 8h9M7.5 12h9M7.5 16h9" />
  </svg>
);

const IconCredentials = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconWAF = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);

const IconRegistry = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const IconAPI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
    <path d="M18 8h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4" />
    <line x1="10" x2="18" y1="12" y2="12" />
  </svg>
);

const IconPod = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" x2="12" y1="22.08" y2="12" />
  </svg>
);

const IconHostNode = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="6" x="2" y="2" rx="2" />
    <rect width="20" height="6" x="2" y="9" rx="2" />
    <rect width="20" height="6" x="2" y="16" rx="2" />
    <line x1="6" x2="6.01" y1="5" y2="5" />
    <line x1="6" x2="6.01" y1="12" y2="12" />
    <line x1="6" x2="6.01" y1="19" y2="19" />
  </svg>
);

const IconPostExploit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    <path d="m19.5 9.5 2.5 2.5-2.5 2.5" />
  </svg>
);

interface CustomNodeProps {
  data: {
    badge?: string;
    title?: string;
    description?: string;
    glow?: string;
    icon?: React.ReactNode;
  };
}

const CustomNodeComponent = ({ data }: CustomNodeProps) => {
  return (
    <>
      {/* Standard vertical handles for Tab 1 */}
      <Handle type="target" position={Position.Top} id="top" style={{ background: data.glow }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: data.glow }} />
      
      {/* Standard horizontal handles for Tab 2 & 3 */}
      <Handle type="target" position={Position.Left} id="left" style={{ background: data.glow }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: data.glow }} />
      
      {/* Custom Right-side handles for Tab 1 Connection Restore */}
      <Handle type="source" position={Position.Right} id="right-source" style={{ top: '35%', background: data.glow }} />
      <Handle type="target" position={Position.Right} id="right-target" style={{ top: '65%', background: data.glow }} />
      
      <div 
        className="custom-node-card" 
        style={{ 
          '--node-glow': data.glow,
          border: `1px solid ${data.glow ? `${data.glow}40` : 'rgba(255,255,255,0.08)'}`,
          boxShadow: data.glow ? `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 12px ${data.glow}20` : '0 8px 30px rgba(0, 0, 0, 0.4)'
        } as React.CSSProperties}
      >
        <div className="node-meta-tag">{data.badge}</div>
        <div className="node-header-row">
          <div className="node-title-main">{data.title}</div>
          <div className="node-icon-wrapper">{data.icon}</div>
        </div>
        <div className="node-desc-text">{data.description}</div>
      </div>
    </>
  );
};

const K8sClusterNodeComponent = () => {
  return (
    <div className="k8s-cluster-container">
      <div className="k8s-cluster-header">
        <span className="cluster-pulse" />
        KUBERNETES CLUSTER
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNodeComponent,
  'k8s-cluster': K8sClusterNodeComponent,
};

// ==========================================
// 3. Tab Datasets Definition
// ==========================================

interface EdgeConfig {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  appearsAt: number;
  color: string;
  type?: string;
  label?: string;
}

// --- TAB 1: Endpoint Agent State Flow ---
const tab1NodesRaw = [
  {
    id: '1',
    appearsAt: 1,
    badge: 'State 1',
    title: 'Never Connected',
    description: 'Record exists on the manager but the local agent has never established a connection.',
    glow: 'var(--accent-rose)',
    icon: <IconNeverConnected />,
    x: 100,
    y: 40,
  },
  {
    id: '2',
    appearsAt: 2,
    badge: 'State 2',
    title: 'Pending Connection',
    description: 'The local daemon is active, running, and broadcasting its first acknowledgment signal.',
    glow: 'var(--accent-amber)',
    icon: <IconPending />,
    x: 100,
    y: 200,
  },
  {
    id: '3',
    appearsAt: 3,
    badge: 'State 3',
    title: 'Active Protection',
    description: 'Heartbeat signal successfully verified by the manager within the last 10 seconds.',
    glow: 'var(--accent-emerald)',
    icon: <IconActive />,
    x: 100,
    y: 360,
  },
  {
    id: '4',
    appearsAt: 4,
    badge: 'State 4',
    title: 'Disconnected Alert',
    description: 'No heartbeat contact has been received by the manager for more than 60 seconds.',
    glow: 'var(--accent-rose)',
    icon: <IconDisconnected />,
    x: 100,
    y: 520,
  },
];

const tab1EdgesRaw: EdgeConfig[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    appearsAt: 2,
    color: 'var(--accent-amber)',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    appearsAt: 3,
    color: 'var(--accent-emerald)',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    appearsAt: 4,
    color: 'var(--accent-rose)',
  },
  {
    id: 'e4-3-restore',
    source: '4',
    target: '3',
    sourceHandle: 'right-source',
    targetHandle: 'right-target',
    appearsAt: 5,
    type: 'step',
    label: 'Connection Restore',
    color: 'var(--accent-indigo)',
  },
];

// --- TAB 2: Log Collector Modules Dataflow ---
const tab2NodesRaw = [
  // Column 1: Event Sources (Appears at Step 1)
  {
    id: 'src-1',
    appearsAt: 1,
    badge: 'SOURCE',
    title: 'Process Auditing',
    description: 'Binary executions, syscall intercepts, processes forks and exits (execve/exit).',
    glow: 'var(--accent-cyan)',
    icon: <IconSource />,
    x: 30,
    y: 30,
  },
  {
    id: 'src-2',
    appearsAt: 1,
    badge: 'SOURCE',
    title: 'File Integrity (FIM)',
    description: 'Creation, writing, permission edits, and file deletions on critical directories.',
    glow: 'var(--accent-cyan)',
    icon: <IconSource />,
    x: 30,
    y: 180,
  },
  {
    id: 'src-3',
    appearsAt: 1,
    badge: 'SOURCE',
    title: 'Network Connections',
    description: 'TCP sockets created, UDP transmissions, DNS lookups and connection alerts.',
    glow: 'var(--accent-cyan)',
    icon: <IconSource />,
    x: 30,
    y: 330,
  },
  {
    id: 'src-4',
    appearsAt: 1,
    badge: 'SOURCE',
    title: 'Registry & Configurations',
    description: 'Modifications to startup launch keys and central configuration profile changes.',
    glow: 'var(--accent-cyan)',
    icon: <IconSource />,
    x: 30,
    y: 480,
  },
  
  // Column 2: Collector Threads (Appears at Step 2)
  {
    id: 'coll-1',
    appearsAt: 2,
    badge: 'COLLECTOR',
    title: 'Process Monitor',
    description: 'Sensor thread listening to kernel forks and mapping pid paths.',
    glow: 'var(--accent-indigo)',
    icon: <IconCollector />,
    x: 340,
    y: 30,
  },
  {
    id: 'coll-2',
    appearsAt: 2,
    badge: 'COLLECTOR',
    title: 'FIM Module',
    description: 'Tracks system config files and hashes sensitive storage regions.',
    glow: 'var(--accent-indigo)',
    icon: <IconCollector />,
    x: 340,
    y: 180,
  },
  {
    id: 'coll-3',
    appearsAt: 2,
    badge: 'COLLECTOR',
    title: 'Network Auditor',
    description: 'Monitors netstat, logs active ports, and registers destination IPs.',
    glow: 'var(--accent-indigo)',
    icon: <IconCollector />,
    x: 340,
    y: 330,
  },
  {
    id: 'coll-4',
    appearsAt: 2,
    badge: 'COLLECTOR',
    title: 'Configuration Sensor',
    description: 'Monitors OS registry files and startup script lists.',
    glow: 'var(--accent-indigo)',
    icon: <IconCollector />,
    x: 340,
    y: 480,
  },
  
  // Column 3: Central Cache (Appears at Step 3)
  {
    id: 'buffer',
    appearsAt: 3,
    badge: 'CACHE STORE',
    title: 'Central Event Buffer',
    description: 'Aggregates telemetry in memory. Disk spools data if shippers go offline.',
    glow: 'var(--accent-violet)',
    icon: <IconBuffer />,
    x: 650,
    y: 255,
  },
  
  // Column 4: Threat Engine (Appears at Step 4)
  {
    id: 'engine',
    appearsAt: 4,
    badge: 'CORE ENGINE',
    title: 'Evaluation Engine',
    description: 'Formats telemetry to JSON, enriches lineage and scans local signature trees.',
    glow: 'var(--accent-pink)',
    icon: <IconEngine />,
    x: 960,
    y: 255,
  },
  
  // Column 5 & 6: Shipper & Cloud (Appears at Step 5)
  {
    id: 'shipper',
    appearsAt: 5,
    badge: 'TRANSPORT',
    title: 'Secure TLS Shipper',
    description: 'Handles client cert pin, buffers shipping batches and starts TLS stream.',
    glow: 'var(--accent-emerald)',
    icon: <IconShipper />,
    x: 1270,
    y: 255,
  },
  {
    id: 'manager',
    appearsAt: 5,
    badge: 'CLOUD SAAS',
    title: 'EDR Cloud Manager',
    description: 'Central datalake analysis, indexing, complex threat correlate and alarms.',
    glow: 'var(--accent-cyan)',
    icon: <IconManager />,
    x: 1580,
    y: 255,
  },
];

const tab2EdgesRaw: EdgeConfig[] = [
  // Step 2 Edges (Source to Collector)
  { id: 'es1-c1', source: 'src-1', target: 'coll-1', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-indigo)' },
  { id: 'es2-c2', source: 'src-2', target: 'coll-2', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-indigo)' },
  { id: 'es3-c3', source: 'src-3', target: 'coll-3', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-indigo)' },
  { id: 'es4-c4', source: 'src-4', target: 'coll-4', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-indigo)' },
  
  // Step 3 Edges (Collector to Central Buffer)
  { id: 'ec1-b', source: 'coll-1', target: 'buffer', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, color: 'var(--accent-violet)' },
  { id: 'ec2-b', source: 'coll-2', target: 'buffer', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, color: 'var(--accent-violet)' },
  { id: 'ec3-b', source: 'coll-3', target: 'buffer', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, color: 'var(--accent-violet)' },
  { id: 'ec4-b', source: 'coll-4', target: 'buffer', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, color: 'var(--accent-violet)' },
  
  // Step 4 Edge (Buffer to Engine)
  { id: 'eb-e', source: 'buffer', target: 'engine', sourceHandle: 'right', targetHandle: 'left', appearsAt: 4, color: 'var(--accent-pink)' },
  
  // Step 5 Edges (Engine to Shipper to Manager)
  { id: 'ee-s', source: 'engine', target: 'shipper', sourceHandle: 'right', targetHandle: 'left', appearsAt: 5, color: 'var(--accent-emerald)' },
  { id: 'es-m', source: 'shipper', target: 'manager', sourceHandle: 'right', targetHandle: 'left', appearsAt: 5, color: 'var(--accent-cyan)' },
];

// --- TAB 3: Attack Vectors on Kubernetes ---
const tab3NodesRaw = [
  // Column 1: Attacker (Appears at Step 1)
  {
    id: 'ATK',
    appearsAt: 1,
    badge: 'THREAT ACTOR',
    title: '🔴 Attacker',
    description: 'External adversary conducting remote host scanning and exploit staging.',
    glow: 'var(--accent-rose)',
    icon: <IconAttacker />,
    x: 30,
    y: 245,
  },
  // Column 2: Vectors (Appears at Step 1)
  {
    id: 'V1',
    appearsAt: 1,
    badge: 'VECTOR 1',
    title: 'RCE / Command Injection',
    description: 'Exploiting input parameters to execute arbitrary system code on backend.',
    glow: 'var(--accent-amber)',
    icon: <IconRCE />,
    x: 330,
    y: 30,
  },
  {
    id: 'V2',
    appearsAt: 1,
    badge: 'VECTOR 2',
    title: 'Supply Chain Hijack',
    description: 'Compromising third-party dependencies or injecting malicious docker layers.',
    glow: 'var(--accent-amber)',
    icon: <IconSupplyChain />,
    x: 330,
    y: 245,
  },
  {
    id: 'V3',
    appearsAt: 1,
    badge: 'VECTOR 3',
    title: 'Credential Theft',
    description: 'Harvesting active service tokens or leaking administrative account secrets.',
    glow: 'var(--accent-amber)',
    icon: <IconCredentials />,
    x: 330,
    y: 460,
  },
  
  // Column 3: Gateways (Appears at Step 2)
  {
    id: 'WAF',
    appearsAt: 2,
    badge: 'PERIMETER',
    title: 'WAF Bypass',
    description: 'Evading active WAF rule matches using encoding or unknown payload scripts.',
    glow: 'var(--accent-indigo)',
    icon: <IconWAF />,
    x: 630,
    y: 30,
  },
  {
    id: 'REG',
    appearsAt: 2,
    badge: 'REGISTRY',
    title: 'Malicious Base Registry',
    description: 'Container registry seeding. Holds backdoored docker libraries.',
    glow: 'var(--accent-indigo)',
    icon: <IconRegistry />,
    x: 630,
    y: 245,
  },
  {
    id: 'API',
    appearsAt: 2,
    badge: 'CONTROL PLANE',
    title: 'K8s API Server Access',
    description: 'Authenticating malicious actions using stolen service account certificates.',
    glow: 'var(--accent-indigo)',
    icon: <IconAPI />,
    x: 630,
    y: 460,
  },
  
  // Column 4: Cluster Container Subgraph Node (Appears at Step 3)
  {
    id: 'K8s',
    appearsAt: 3,
    type: 'k8s-cluster',
    x: 930,
    y: 30,
    width: 300,
    height: 505,
  },
  // Inside Cluster: Child Workloads
  {
    id: 'POD',
    appearsAt: 3,
    parentNode: 'K8s',
    extent: 'parent',
    badge: 'COMPROMISED WORKLOAD',
    title: '📦 Targeted Pod',
    description: 'Sandboxed application container hosting compromised service shells.',
    glow: 'var(--accent-pink)',
    icon: <IconPod />,
    x: 20,
    y: 110,
  },
  {
    id: 'NODE',
    appearsAt: 5,
    parentNode: 'K8s',
    extent: 'parent',
    badge: 'HOST CLUSTER LEASE',
    title: 'Host Node Breakout',
    description: 'Escaped container layer accessing host processes and physical hypervisor nodes.',
    glow: 'var(--accent-rose)',
    icon: <IconHostNode />,
    x: 20,
    y: 320,
  },
  
  // Column 5: Post Exploitation (Appears at Step 4)
  {
    id: 'POST',
    appearsAt: 4,
    badge: 'C2 POST-EXPLOIT',
    title: 'C2 Webshell Tunnel',
    description: 'Active webshell establishing external reverse command channels and mining data.',
    glow: 'var(--accent-rose)',
    icon: <IconPostExploit />,
    x: 1290,
    y: 140,
  },
];

const tab3EdgesRaw: EdgeConfig[] = [
  // Step 1: Attacker to Vectors
  { id: 'eat-v1', source: 'ATK', target: 'V1', sourceHandle: 'right', targetHandle: 'left', appearsAt: 1, color: 'var(--accent-rose)' },
  { id: 'eat-v2', source: 'ATK', target: 'V2', sourceHandle: 'right', targetHandle: 'left', appearsAt: 1, color: 'var(--accent-rose)' },
  { id: 'eat-v3', source: 'ATK', target: 'V3', sourceHandle: 'right', targetHandle: 'left', appearsAt: 1, color: 'var(--accent-rose)' },
  
  // Step 2: Vectors to Gateways
  { id: 'ev1-w', source: 'V1', target: 'WAF', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-amber)' },
  { id: 'ev2-r', source: 'V2', target: 'REG', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-amber)' },
  { id: 'ev3-a', source: 'V3', target: 'API', sourceHandle: 'right', targetHandle: 'left', appearsAt: 2, color: 'var(--accent-amber)' },
  
  // Step 3: Gateways to Pod
  { id: 'ew-p', source: 'WAF', target: 'POD', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, label: 'bypass & exploit', color: 'var(--accent-indigo)' },
  { id: 'er-p', source: 'REG', target: 'POD', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, label: 'pull malicious image', color: 'var(--accent-indigo)' },
  { id: 'ea-p', source: 'API', target: 'POD', sourceHandle: 'right', targetHandle: 'left', appearsAt: 3, label: 'stolen token', color: 'var(--accent-indigo)' },
  
  // Step 4: Pod to Post Exploitation
  { id: 'ep-po', source: 'POD', target: 'POST', sourceHandle: 'right', targetHandle: 'left', appearsAt: 4, label: 'post-exploit', color: 'var(--accent-pink)' },
  
  // Step 5: Pod to Host Node Escape
  { id: 'ep-n', source: 'POD', target: 'NODE', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 5, label: 'escape', color: 'var(--accent-rose)' },
];

// --- Walkthrough Database ---
const walkthroughData: Record<'tab1' | 'tab2' | 'tab3' | 'tab4', Record<number, {
  title: string;
  stageTag: string;
  description: string;
  technicalDetails: string;
  technologies: string[];
  icon: React.ReactNode;
}>> = {
  tab1: {
    1: {
      title: 'Never Connected',
      stageTag: 'INITIAL ENROLLMENT',
      description: 'The endpoint agent record is created in the central manager\'s system database (for instance, via a mass deployment config profile or script staging). However, no communication has ever been established from the local system.',
      technicalDetails: 'API portals are configured and staging enrollment keys are issued, but no agent identity lease has been claimed yet.',
      technologies: ['SaaS Manager', 'Enrolment API', 'Staging Keys'],
      icon: <IconNeverConnected />,
    },
    2: {
      title: 'Pending Connection',
      stageTag: 'AGENT HANDSHAKE',
      description: 'The local EDR daemon is running on the endpoint. It registers local configuration keys, generates cryptographic identification certs, and broadcasts authentication handshakes to the EDR manager.',
      technicalDetails: 'The client issues an initial TLS request containing endpoint properties (hostname, architecture, OS fingerprint) and awaits configuration metadata.',
      technologies: ['OS Daemon Service', 'TLS Handshake', 'Machine ID Sync'],
      icon: <IconPending />,
    },
    3: {
      title: 'Active Protection',
      stageTag: 'TELEMETRY STREAM OPEN',
      description: 'Handshake completed. The agent is actively communicating with the manager. Bidirectional heartbeat pulses and telemetry updates are exchanged regularly, ensuring the host is secure.',
      technicalDetails: 'Establishes a persistent TCP pipeline. Heartbeat packets check policy versions. Telemetry queues stream processes and file integrity records smoothly.',
      technologies: ['Heartbeat Pulses', 'TCP Sockets', 'Policy Enforcement'],
      icon: <IconActive />,
    },
    4: {
      title: 'Disconnected Alert',
      stageTag: 'COMMUNICATION TIME-OUT',
      description: 'The endpoint agent has failed to report to the EDR manager for an extended period. Once the keep-alive timeout threshold exceeds 60 seconds, the manager flags the agent as "Disconnected".',
      technicalDetails: 'The central manager monitors agent keep-alives. When a heartbeat fails to resolve for 60s, database state transitions trigger automated administrator incident cases.',
      technologies: ['Keep-Alive Timeout', 'State Index Database', 'SysAdmin Alarms'],
      icon: <IconDisconnected />,
    },
    5: {
      title: 'Connection Restored',
      stageTag: 'NETWORK RECOVERY',
      description: 'Network link is established again. The local shipper detects the online state, runs a re-authentication exchange, flushes the cached offline events queue, and restores the agent to an "Active" state.',
      technicalDetails: 'Triggers local buffer queue sweeps. Flushes encrypted local disk spools to the shipper thread and executes a secure lease renewal with the SaaS gateway.',
      technologies: ['Local Queue Flush', 'Secure Lease Renewal', 'mTLS Pipeline'],
      icon: <IconActive />,
    },
  },
  tab2: {
    1: {
      title: 'Raw Event Sources',
      stageTag: 'SYSTEM CALL INTERCEPTS',
      description: 'Activity begins at the OS kernel boundary. Binary executions, filesystem creation, socket binds, and config modifications generate raw logs intercepted by low-level hooks or filter drivers.',
      technicalDetails: 'Utilizes kernel-level sensor APIs (e.g. FSEvents, eBPF probes, Windows Registry callbacks) to trap raw events at zero-day interfaces with zero user-space latency.',
      technologies: ['eBPF Hooks', 'FSEvents API', 'Registry Callback', 'Kprobes'],
      icon: <IconSource />,
    },
    2: {
      title: 'Log Collector Threads',
      stageTag: 'TELEMETRY DEMULTIPLEXING',
      description: 'Isolated monitoring threads running inside the local EDR daemon subscribe to event hooks. Process forks, filesystem integrity monitoring (FIM), network connections, and registry actions are captured independently.',
      technicalDetails: 'Separates event streams into dedicated module executors. This modularity prevents process bottlenecking and ensures system stability if a single sensor crashes.',
      technologies: ['Process Auditor Thread', 'FIM Controller', 'Net Tracker', 'Registry Sensor'],
      icon: <IconCollector />,
    },
    3: {
      title: 'Central Event Buffer',
      stageTag: 'ENCRYPTED DISK STORAGE',
      description: 'Raw telemetry events are compiled in a central high-speed memory cache. In case the host goes offline, the daemon automatically spools telemetry into encrypted local disk queues, preventing data loss.',
      technicalDetails: 'Utilizes high-throughput ring buffers to capture events under spike loads. Encryption protects the cached files from local host tampering by sophisticated malware.',
      technologies: ['Memory-Mapped Ring Buffer', 'Encrypted Disk Spool', 'Tamper-Proof Storage'],
      icon: <IconBuffer />,
    },
    4: {
      title: 'Evaluation & Parsing Engine',
      stageTag: 'PARSING & CORRELATION',
      description: 'Telemetry is parsed into uniform schemas, enriched with key system metadata (such as parent process trees and active user sessions), and evaluated against local behavioral detection rules.',
      technicalDetails: 'Extracts hash values and tracks parent-child process lineage trees. Local heuristic rules trigger immediate local network containment if active malware signatures resolve.',
      technologies: ['JSON Schema Mapper', 'Process Lineage Engine', 'Local Threat Heuristics'],
      icon: <IconEngine />,
    },
    5: {
      title: 'Secure Cloud Ingestion',
      stageTag: 'CENTRAL SAAS CONTROL',
      description: 'The local shipping module packages enriched telemetry and streams it over secure mutual TLS to the Cloud EDR Manager. Large-scale behavioral analytics, indexing, and incident responses are coordinated here.',
      technicalDetails: 'Employs certificate pinning and HTTP/2 compression. Ingested events map instantly to MITRE ATT&CK techniques, generating security operations alerts.',
      technologies: ['mTLS Stream (TLS 1.3)', 'Cloud Ingest Gateway', 'MITRE ATT&CK Matrix'],
      icon: <IconManager />,
    },
  },
  tab3: {
    1: {
      title: 'Attacker Inception',
      stageTag: 'THREAT RECONNAISSANCE',
      description: 'A remote threat actor stages parallel attack vectors against the cloud infrastructure: targeting software input filters, injecting backdoors in dependencies, or harvesting static administration tokens.',
      technicalDetails: 'Attacker launches vulnerability scans, queries public code repositories, and sniffs network configuration exposures to outline target cluster resources.',
      technologies: ['Port Scanners', 'OWASP Top 10 Probes', 'Dependency Sweepers'],
      icon: <IconAttacker />,
    },
    2: {
      title: 'Perimeter Exploitation',
      stageTag: 'GATEWAY INTRUSION',
      description: 'Exploits traverse active perimeters: evading web application firewalls, hosting backdoored images in compromised registries, or accessing control plane APIs with valid credentials.',
      technicalDetails: 'Attacker uses evasion vectors (like base64 query payloads) to bypass rule signatures, and registers service keys with target endpoint portals.',
      technologies: ['WAF Rule Evasion', 'Stolen Credentials', 'Docker Push API'],
      icon: <IconCredentials />,
    },
    3: {
      title: 'Targeted Pod Compromise',
      stageTag: 'CONTAINER COMPROMISE',
      description: 'Breaches converge on the cloud workload. Compromised configurations or payload exploits succeed in spawning a shell process inside a sandboxed container, compromising the Pod.',
      technicalDetails: 'Payload launches standard webshell execution threads. Exploit establishes active socket leases directly within the restricted Kubernetes namespace boundaries.',
      technologies: ['Workload Sandbox', 'RCE Shell Spawn', 'Namespace Intrusion'],
      icon: <IconPod />,
    },
    4: {
      title: 'C2 Tunnels & Cryptomining',
      stageTag: 'POST-EXPLOITATION',
      description: 'Adversary leverages container control: establishing reverse command and control (C2) channels, staging sensitive database file exports, and running active mining operations.',
      technicalDetails: 'Malware connects outbound sockets to public IP C2 proxies, deploys automated background mining processes, and executes rootkit installation sequences.',
      technologies: ['Reverse Shell Sockets', 'C2 Tunneling Proxies', 'Monero Cryptomining'],
      icon: <IconPostExploit />,
    },
    5: {
      title: 'Host Node Escape Breakout',
      stageTag: 'LATERAL ESCAPE',
      description: 'Exploiting shared system namespaces, kernel system calls, or local host directory mounts, the attacker breaks container virtualization boundaries and gains full administrative root access onto the physical Host Node.',
      technicalDetails: 'Executes container breakout vectors (e.g., abusing privileged containers, mounting host paths, or exploitation of local CVE kernel vulnerabilities) to compromise the root node VM.',
      technologies: ['Privileged Sandbox Break', 'Host Mount Abuse', 'Kernel Privilege Escalation'],
      icon: <IconHostNode />,
    },
  },
  tab4: {
    1: {
      title: 'Layer 1: OCSF Telemetry Log Collector',
      stageTag: 'STANDARDIZED TELEMETRY STREAM',
      description: 'Collects, normalizes, and groups all low-level telemetry records into standardized Open Cybersecurity Schema Framework (OCSF) JSON structures.',
      technicalDetails: 'Standardizes disparate kernel signals to OCSF events, buffering and cryptographically signing batches before streaming over persistent mutual TLS to SaaS managers.',
      technologies: ['OCSF 1.7.0', 'mTLS Stream', 'Telemetry Enforcer'],
      icon: <IconNeverConnected />,
    },
    2: {
      title: 'Layer 2: Network Connection & Socket Filtering',
      stageTag: 'NETWORK PERIMETER CONTROL',
      description: 'Monitors, intercepts, and controls outbound sockets, remote port bounds, TCP/UDP streams, and DNS queries staged by process executors.',
      technicalDetails: 'Uses Network Filter extensions on macOS, Windows Filtering Platform (WFP) on Windows, and eBPF socket classifiers/cgroups on Linux.',
      technologies: ['cgroups socket', 'WFP drivers', 'macOS Network Filters'],
      icon: <IconNeverConnected />,
    },
    3: {
      title: 'Layer 3: File System Integrity & Monitoring',
      stageTag: 'FILESYSTEM FILTER DRIVERS',
      description: 'Tracks and regulates real-time read, write, execution, deletion, and directory modification events across physical and virtual disk systems.',
      technicalDetails: 'Employs eBPF kprobes and tracepoints on Linux, File System Minifilters on Windows, and Endpoint Security Framework (ESF) file hooks on macOS.',
      technologies: ['eBPF Kprobes', 'Minifilters', 'macOS ESF'],
      icon: <IconNeverConnected />,
    },
    4: {
      title: 'Layer 4: Static Signature Scanner',
      stageTag: 'BINARY INTEGRITY CHECK',
      description: 'Performs on-demand or execution-time static parsing and entropy reviews of executable files to detect known signatures or suspicious packaging.',
      technicalDetails: 'Runs high-throughput hash lookups against local signature trees and extracts structural properties (PE/ELF headers) inside highly sandboxed user-space scanners.',
      technologies: ['YARA signatures', 'PE/ELF Parser', 'Entropy Scan'],
      icon: <IconNeverConnected />,
    },
    5: {
      title: 'Layer 5: Early Launch Security (ELAM)',
      stageTag: 'KERNEL BOUNDARY SECURITY',
      description: 'The foundation of the EDR architecture. Ensures that security hooks and policies are loaded at the earliest boot sequence before any user-space system services or potential malware initiate.',
      technicalDetails: 'Integrated within initramfs on Linux (using early BPF LSM loading) and ELAM system driver registries on Windows to validate early boot path signatures.',
      technologies: ['BPF LSM', 'initramfs loader', 'ELAM Drivers'],
      icon: <IconNeverConnected />,
    },
  },
};

// ==========================================
// 3.5 Tab 4 Definitions & Markdown Renderer
// ==========================================

// Dynamically load the PRD markdown files from /prds
const prdFiles = import.meta.glob('../prds/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Helper to parse filename metadata
const parsePrdFile = (key: string, content: string) => {
  const filename = key.split('/').pop() || '';
  let platform: 'linux' | 'macos' | 'windows' | 'global' = 'global';
  if (filename.startsWith('Linux_')) platform = 'linux';
  else if (filename.startsWith('macOS_')) platform = 'macos';
  else if (filename.startsWith('Windows_')) platform = 'windows';

  let layer = 1;
  let badge = 'PRD INDEX';
  let title: string;
  let glow = 'var(--accent-cyan)';

  if (filename === 'README.md') {
    layer = 1;
    badge = 'OVERVIEW';
    title = 'EDR System PRDs';
    glow = 'var(--accent-amber)';
  } else if (filename.includes('OCSF')) {
    layer = 1;
    badge = 'LOG COLLECTOR';
    title = platform === 'linux' 
      ? 'Linux OCSF Log Collector' 
      : platform === 'macos' 
        ? 'macOS OCSF Log Collector' 
        : 'Windows OCSF Log Collector';
    glow = 'var(--accent-emerald)';
  } else if (filename.includes('Network')) {
    layer = 2;
    badge = 'NET FIREWALL';
    title = platform === 'linux' 
      ? 'Linux Network Filtering' 
      : platform === 'macos' 
        ? 'macOS Network Filtering' 
        : 'Windows Network Filtering';
    glow = 'var(--accent-rose)';
  } else if (filename.includes('File') || filename.includes('eBPF') || filename.includes('ES') || filename.includes('Minifilter')) {
    layer = 3;
    badge = 'FILE SECURITY';
    title = platform === 'linux' 
      ? 'Linux eBPF File Mon' 
      : platform === 'macos' 
        ? 'macOS ES File Mon' 
        : 'Windows Minifilter Mon';
    glow = 'var(--accent-indigo)';
  } else if (filename.includes('Static')) {
    layer = 4;
    badge = 'STATIC SCANNER';
    title = platform === 'linux' 
      ? 'Linux Static Scanner' 
      : platform === 'macos' 
        ? 'macOS Static Scanner' 
        : 'Windows Static Scanner';
    glow = 'var(--accent-violet)';
  } else if (filename.includes('ELAM')) {
    layer = 5;
    badge = 'EARLY LAUNCH';
    title = platform === 'linux' ? 'Linux LSM / ELAM PRD' : 'macOS ELAM PRD';
    glow = 'var(--accent-cyan)';
  } else {
    title = filename.replace(/_/g, ' ').replace('.md', '');
  }

  return {
    id: key,
    filename,
    platform,
    layer,
    badge,
    title,
    glow,
    content
  };
};

const parsedPrds = Object.entries(prdFiles).map(([key, content]) => {
  return parsePrdFile(key, content);
});

// Dynamic grid coordinate assignment for columns and layers
const getPrdCoordinates = (platform: string, layer: number) => {
  if (platform === 'global') {
    return { x: 380, y: -100 };
  }
  
  let x = 380;
  if (platform === 'linux') x = 50;
  else if (platform === 'macos') x = 380;
  else if (platform === 'windows') x = 710;

  const y = 50 + (layer - 1) * 150;
  return { x, y };
};

// Edge routing definitions
const tab4EdgesRaw: EdgeConfig[] = [
  // Global entries from README to first layer (OCSF Collector)
  { id: 'e-global-linux', source: '../prds/README.md', target: '../prds/Linux_OCSF_Log_Collector_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 1, color: 'var(--accent-emerald)' },
  { id: 'e-global-macos', source: '../prds/README.md', target: '../prds/macOS_OCSF_Log_Collector_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 1, color: 'var(--accent-emerald)' },
  { id: 'e-global-windows', source: '../prds/README.md', target: '../prds/Windows_OCSF_Log_Collector_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 1, color: 'var(--accent-emerald)' },

  // Linux column sequence: OCSF -> Net -> File -> Static -> ELAM
  { id: 'e-linux-1-2', source: '../prds/Linux_OCSF_Log_Collector_PRD.md', target: '../prds/Linux_Network_Filtering_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 2, color: 'var(--accent-rose)' },
  { id: 'e-linux-2-3', source: '../prds/Linux_Network_Filtering_PRD.md', target: '../prds/Linux_eBPF_File_Monitoring_Module.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 3, color: 'var(--accent-indigo)' },
  { id: 'e-linux-3-4', source: '../prds/Linux_eBPF_File_Monitoring_Module.md', target: '../prds/Linux_Static_Scanner_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 4, color: 'var(--accent-violet)' },
  { id: 'e-linux-4-5', source: '../prds/Linux_Static_Scanner_PRD.md', target: '../prds/Linux_ELAM_Equivalent_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 5, color: 'var(--accent-cyan)' },

  // macOS column sequence: OCSF -> Net -> File -> Static -> ELAM
  { id: 'e-macos-1-2', source: '../prds/macOS_OCSF_Log_Collector_PRD.md', target: '../prds/macOS_Network_Filtering_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 2, color: 'var(--accent-rose)' },
  { id: 'e-macos-2-3', source: '../prds/macOS_Network_Filtering_PRD.md', target: '../prds/macOS_ES_File_Monitoring_Module.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 3, color: 'var(--accent-indigo)' },
  { id: 'e-macos-3-4', source: '../prds/macOS_ES_File_Monitoring_Module.md', target: '../prds/macOS_Static_Scanner_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 4, color: 'var(--accent-violet)' },
  { id: 'e-macos-4-5', source: '../prds/macOS_Static_Scanner_PRD.md', target: '../prds/macOS_ELAM_Equivalent_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 5, color: 'var(--accent-cyan)' },

  // Windows column sequence: OCSF -> Net -> File (Minifilter) -> Static
  { id: 'e-windows-1-2', source: '../prds/Windows_OCSF_Log_Collector_PRD.md', target: '../prds/Windows_Network_Filtering_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 2, color: 'var(--accent-rose)' },
  { id: 'e-windows-2-3', source: '../prds/Windows_Network_Filtering_PRD.md', target: '../prds/Windows_Minifilter_Monitoring_Module.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 3, color: 'var(--accent-indigo)' },
  { id: 'e-windows-3-4', source: '../prds/Windows_Minifilter_Monitoring_Module.md', target: '../prds/Windows_Static_Scanner_PRD.md', sourceHandle: 'bottom', targetHandle: 'top', appearsAt: 4, color: 'var(--accent-violet)' },
];

// Custom Regex-based markdown parser
const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let inList = false;
  let listItems: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const parseInline = (line: string) => {
    let temp = line;
    temp = temp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    temp = temp.replace(/`(.*?)`/g, '<code>$1</code>');
    return <span dangerouslySetInnerHTML={{ __html: temp }} />;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('|')) {
      if (inList) {
        renderedElements.push(<ul key={`list-${i}`}>{listItems}</ul>);
        inList = false;
        listItems = [];
      }
      
      inTable = true;
      if (line.includes('---')) {
        continue;
      }
      
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      if (inTable) {
        renderedElements.push(
          <div key={`table-wrapper-${i}`} className="table-responsive" style={{ overflowX: 'auto', width: '100%' }}>
            <table key={`table-${i}`}>
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => <th key={idx}>{parseInline(h)}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => <td key={cIdx}>{parseInline(cell)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    }

    if (line.startsWith('* ') || line.startsWith('- ')) {
      inList = true;
      listItems.push(<li key={`li-${i}`}>{parseInline(line.substring(2))}</li>);
      continue;
    } else if (line.match(/^\d+\.\s/)) {
      inList = true;
      const match = line.match(/^\d+\.\s(.*)/);
      listItems.push(<li key={`li-${i}`}>{parseInline(match ? match[1] : line)}</li>);
      continue;
    } else {
      if (inList) {
        renderedElements.push(<ul key={`list-${i}`}>{listItems}</ul>);
        inList = false;
        listItems = [];
      }
    }

    if (line === '') {
      continue;
    }

    if (line.startsWith('# ')) {
      renderedElements.push(<h1 key={i}>{parseInline(line.substring(2))}</h1>);
    } else if (line.startsWith('## ')) {
      renderedElements.push(<h2 key={i}>{parseInline(line.substring(3))}</h2>);
    } else if (line.startsWith('### ')) {
      renderedElements.push(<h3 key={i}>{parseInline(line.substring(4))}</h3>);
    } else if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={i}>
          <p>{parseInline(line.substring(2))}</p>
        </blockquote>
      );
    } else if (line.startsWith('---')) {
      renderedElements.push(<hr key={i} />);
    } else {
      renderedElements.push(<p key={i}>{parseInline(line)}</p>);
    }
  }

  if (inList) {
    renderedElements.push(<ul key={`list-end`}>{listItems}</ul>);
  }
  if (inTable) {
    renderedElements.push(
      <div key={`table-wrapper-end`} className="table-responsive" style={{ overflowX: 'auto', width: '100%' }}>
        <table>
          <thead>
            <tr>
              {tableHeaders.map((h, idx) => <th key={idx}>{parseInline(h)}</th>)}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => <td key={cIdx}>{parseInline(cell)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div className="markdown-content">{renderedElements}</div>;
};

const MAX_STEPS = 5;

// ==========================================
// 4. Main Application Component
// ==========================================

function App() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3' | 'tab4'>('tab1');
  const [tab1Step, setTab1Step] = useState(1);
  const [tab2Step, setTab2Step] = useState(1);
  const [tab3Step, setTab3Step] = useState(1);
  const [tab4Step, setTab4Step] = useState(1);
  const [selectedPrdId, setSelectedPrdId] = useState<string>('../prds/README.md');
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - mouseMoveEvent.clientX;
      if (newWidth > 280 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // Active step depending on the tab
  const activeStep = activeTab === 'tab1' ? tab1Step : activeTab === 'tab2' ? tab2Step : activeTab === 'tab3' ? tab3Step : tab4Step;

  // ReactFlow Nodes Creation (interactive dashboard view)
  const nodes = useMemo(() => {
    if (activeTab === 'tab1') {
      return tab1NodesRaw.map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: node.x, y: node.y },
        data: {
          badge: node.badge,
          title: node.title,
          description: node.description,
          glow: node.glow,
          icon: node.icon,
        },
        style: {
          width: 260,
          opacity: tab1Step >= node.appearsAt ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: tab1Step >= node.appearsAt ? 'auto' : 'none',
        },
      }));
    } else if (activeTab === 'tab2') {
      return tab2NodesRaw.map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: node.x, y: node.y },
        data: {
          badge: node.badge,
          title: node.title,
          description: node.description,
          glow: node.glow,
          icon: node.icon,
        },
        style: {
          width: 260,
          opacity: tab2Step >= node.appearsAt ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: tab2Step >= node.appearsAt ? 'auto' : 'none',
        },
      }));
    } else if (activeTab === 'tab3') {
      return tab3NodesRaw.map((node) => ({
        id: node.id,
        type: node.type || 'custom',
        position: { x: node.x, y: node.y },
        parentNode: node.parentNode,
        extent: node.extent,
        data: {
          badge: node.badge,
          title: node.title,
          description: node.description,
          glow: node.glow,
          icon: node.icon,
        },
        style: {
          width: node.type === 'k8s-cluster' ? node.width : 260,
          height: node.type === 'k8s-cluster' ? node.height : undefined,
          opacity: tab3Step >= node.appearsAt ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: tab3Step >= node.appearsAt ? 'auto' : 'none',
        },
      }));
    } else {
      return parsedPrds.map((prd) => {
        const coords = getPrdCoordinates(prd.platform, prd.layer);
        const isActive = prd.id === selectedPrdId;
        
        return {
          id: prd.id,
          type: 'custom',
          position: coords,
          data: {
            badge: prd.badge,
            title: prd.title,
            description: `Requirements PRD file: ${prd.filename}`,
            glow: prd.glow,
            icon: prd.platform === 'linux' 
              ? <IconSource /> 
              : prd.platform === 'macos' 
                ? <IconActive /> 
                : prd.platform === 'windows' 
                  ? <IconNeverConnected /> 
                  : <IconManager />,
          },
          style: {
            width: 260,
            opacity: tab4Step >= prd.layer ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out, border-color 0.3s ease, box-shadow 0.3s ease',
            pointerEvents: tab4Step >= prd.layer ? 'auto' : 'none',
          },
          className: isActive ? 'prd-active-node' : '',
        };
      });
    }
  }, [activeTab, tab1Step, tab2Step, tab3Step, tab4Step, selectedPrdId]);

  // ReactFlow Edges Creation (interactive dashboard view)
  const edges = useMemo(() => {
    if (activeTab === 'tab1') {
      return tab1EdgesRaw.map((edge) => {
        const isVisible = tab1Step >= edge.appearsAt;
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    } else if (activeTab === 'tab2') {
      return tab2EdgesRaw.map((edge) => {
        const isVisible = tab2Step >= edge.appearsAt;
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    } else if (activeTab === 'tab3') {
      return tab3EdgesRaw.map((edge) => {
        const isVisible = tab3Step >= edge.appearsAt;
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    } else {
      return tab4EdgesRaw.map((edge) => {
        const isVisible = tab4Step >= edge.appearsAt;
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    }
  }, [activeTab, tab1Step, tab2Step, tab3Step, tab4Step]);

  // Helpers to get specific state parameters per page when generating print files
  const getNodesForStep = useCallback((step: number) => {
    if (activeTab === 'tab1') {
      return tab1NodesRaw.map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: node.x, y: node.y },
        data: {
          badge: node.badge,
          title: node.title,
          description: node.description,
          glow: node.glow,
          icon: node.icon,
        },
        style: {
          width: 260,
          opacity: step >= node.appearsAt ? 1 : 0,
        },
      }));
    } else if (activeTab === 'tab2') {
      return tab2NodesRaw.map((node) => ({
        id: node.id,
        type: 'custom',
        position: { x: node.x, y: node.y },
        data: {
          badge: node.badge,
          title: node.title,
          description: node.description,
          glow: node.glow,
          icon: node.icon,
        },
        style: {
          width: 260,
          opacity: step >= node.appearsAt ? 1 : 0,
        },
      }));
    } else if (activeTab === 'tab3') {
      return tab3NodesRaw.map((node) => ({
        id: node.id,
        type: node.type || 'custom',
        position: { x: node.x, y: node.y },
        parentNode: node.parentNode,
        extent: node.extent,
        data: {
          badge: node.badge,
          title: node.title,
          description: node.description,
          glow: node.glow,
          icon: node.icon,
        },
        style: {
          width: node.type === 'k8s-cluster' ? node.width : 260,
          height: node.type === 'k8s-cluster' ? node.height : undefined,
          opacity: step >= node.appearsAt ? 1 : 0,
        },
      }));
    } else {
      return parsedPrds.map((prd) => {
        const coords = getPrdCoordinates(prd.platform, prd.layer);
        return {
          id: prd.id,
          type: 'custom',
          position: coords,
          data: {
            badge: prd.badge,
            title: prd.title,
            description: `Requirements PRD file: ${prd.filename}`,
            glow: prd.glow,
            icon: prd.platform === 'linux' 
              ? <IconSource /> 
              : prd.platform === 'macos' 
                ? <IconActive /> 
                : prd.platform === 'windows' 
                  ? <IconNeverConnected /> 
                  : <IconManager />,
          },
          style: {
            width: 260,
            opacity: step >= prd.layer ? 1 : 0,
          },
        };
      });
    }
  }, [activeTab]);

  const getEdgesForStep = useCallback((step: number) => {
    if (activeTab === 'tab1') {
      return tab1EdgesRaw.map((edge) => {
        const isVisible = step >= edge.appearsAt;
        return {
          id: `${edge.id}-print-${step}`,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    } else if (activeTab === 'tab2') {
      return tab2EdgesRaw.map((edge) => {
        const isVisible = step >= edge.appearsAt;
        return {
          id: `${edge.id}-print-${step}`,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    } else if (activeTab === 'tab3') {
      return tab3EdgesRaw.map((edge) => {
        const isVisible = step >= edge.appearsAt;
        return {
          id: `${edge.id}-print-${step}`,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    } else {
      return tab4EdgesRaw.map((edge) => {
        const isVisible = step >= edge.appearsAt;
        return {
          id: `${edge.id}-print-${step}`,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          type: edge.type || 'default',
          label: isVisible ? edge.label : undefined,
          className: isVisible ? 'flowing-animated-edge' : '',
          style: {
            '--edge-color': edge.color || 'var(--accent-indigo)',
            opacity: isVisible ? 1 : 0,
          } as React.CSSProperties,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isVisible ? edge.color : 'transparent',
          },
        };
      });
    }
  }, [activeTab]);

  // --- Step Controls ---
  const handleNext = useCallback(() => {
    if (activeTab === 'tab1') {
      if (tab1Step < MAX_STEPS) setTab1Step((s) => s + 1);
    } else if (activeTab === 'tab2') {
      if (tab2Step < MAX_STEPS) setTab2Step((s) => s + 1);
    } else if (activeTab === 'tab3') {
      if (tab3Step < MAX_STEPS) setTab3Step((s) => s + 1);
    } else {
      if (tab4Step < MAX_STEPS) setTab4Step((s) => s + 1);
    }
  }, [activeTab, tab1Step, tab2Step, tab3Step, tab4Step]);

  const handlePrev = useCallback(() => {
    if (activeTab === 'tab1') {
      if (tab1Step > 1) setTab1Step((s) => s - 1);
    } else if (activeTab === 'tab2') {
      if (tab2Step > 1) setTab2Step((s) => s - 1);
    } else if (activeTab === 'tab3') {
      if (tab3Step > 1) setTab3Step((s) => s - 1);
    } else {
      if (tab4Step > 1) setTab4Step((s) => s - 1);
    }
  }, [activeTab, tab1Step, tab2Step, tab3Step, tab4Step]);

  const handleReset = useCallback(() => {
    if (activeTab === 'tab1') {
      setTab1Step(1);
    } else if (activeTab === 'tab2') {
      setTab2Step(1);
    } else if (activeTab === 'tab3') {
      setTab3Step(1);
    } else {
      setTab4Step(1);
    }
  }, [activeTab]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  const handleTabChange = useCallback((tab: 'tab1' | 'tab2' | 'tab3' | 'tab4') => {
    setActiveTab(tab);
  }, []);

  // Fetch walkthrough data corresponding to active state/step
  const activeWalkthrough = useMemo(() => {
    const data = walkthroughData[activeTab][activeStep];
    return data || {
      title: 'Unknown State',
      stageTag: 'UNKNOWN',
      description: 'No detailed information is registered for the selected step.',
      technicalDetails: '',
      technologies: [],
      icon: <IconNeverConnected />,
    };
  }, [activeTab, activeStep]);

  return (
    <>
      <div className="app-container" style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}>
      {/* Header bar and tab buttons */}
      <header className="header-bar">
        <div className="brand-section">
          <div className="brand-title">
            <span className="pulse-dot" />
            <h1>EDR WORKFLOW INSIGHT</h1>
          </div>
          <p className="brand-desc">Interactive endpoint security daemon visualizer</p>
        </div>

        <nav className="tabs-container">
          <button 
            onClick={() => handleTabChange('tab1')} 
            className={`tab-btn ${activeTab === 'tab1' ? 'active' : ''}`}
          >
            <IconActive /> Endpoint Agent State
          </button>
          <button 
            onClick={() => handleTabChange('tab2')} 
            className={`tab-btn ${activeTab === 'tab2' ? 'active' : ''}`}
          >
            <IconSource /> Log Collector Dataflow
          </button>
          <button 
            onClick={() => handleTabChange('tab3')} 
            className={`tab-btn ${activeTab === 'tab3' ? 'active' : ''}`}
          >
            <IconAttacker /> K8s Attack Vectors
          </button>
          <button 
            onClick={() => handleTabChange('tab4')} 
            className={`tab-btn ${activeTab === 'tab4' ? 'active' : ''}`}
          >
            <IconPDF /> Architecture & PRDs
          </button>
        </nav>
      </header>

      {/* Workspace Area: Flowchart & Info Sidebar */}
      <main className="main-workspace">
        
        {/* Flowchart viewport */}
        <section className="flow-viewport">
          <ReactFlow
            nodes={nodes as Node[]}
            edges={edges as Edge[]}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            zoomOnScroll={true}
            panOnDrag={true}
            onNodeClick={activeTab === 'tab4' ? (_e, node) => setSelectedPrdId(node.id) : undefined}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#222635" />
            <Controls showInteractive={false} />
          </ReactFlow>

          {/* Stepper navigation bar */}
          <div className="bottom-controls-bar">
            <div className="navigation-buttons">
              <button 
                onClick={handlePrev} 
                disabled={activeStep <= 1} 
                className="nav-btn"
              >
                Previous
              </button>
              <button 
                onClick={handleNext} 
                disabled={activeStep >= MAX_STEPS} 
                className="nav-btn"
              >
                Next Step
              </button>
              <button onClick={handleReset} className="reset-btn">
                Reset Flow
              </button>
              <button onClick={handleExportPDF} className="pdf-btn">
                <IconPDF /> Export PDF
              </button>
            </div>

            {/* Futuristic Stepper Progress Indicators */}
            <div className="stepper-progress-container">
              <div className="stepper-dots-row">
                {Array.from({ length: MAX_STEPS }).map((_, idx) => {
                  const stepNum = idx + 1;
                  const isActive = stepNum === activeStep;
                  const isPassed = stepNum < activeStep;
                  return (
                    <span 
                      key={idx} 
                      className={`step-dot ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`} 
                    />
                  );
                })}
              </div>
              <span className="step-label-counter">
                Phase {activeStep} of {MAX_STEPS}
              </span>
            </div>
          </div>
        </section>

        {/* Walkthrough Detail / PRD Reader Sidebar */}
        <aside className="walkthrough-panel" style={{ width: `${sidebarWidth}px`, position: 'relative' }}>
          <div className="sidebar-resizer" onMouseDown={startResizing} />
          {activeTab === 'tab4' ? (
            // Tab 4: Requirement PRD Reader
            (() => {
              const activePrd = parsedPrds.find(p => p.id === selectedPrdId);
              return (
                <div className="prd-reader-container">
                  {activePrd ? (
                    <>
                      <div className="prd-reader-header" style={{ padding: '24px 24px 0 24px' }}>
                        <h2 style={{ textTransform: 'none' }}>{activePrd.title}</h2>
                        <div className="prd-meta-row" style={{ marginTop: '8px' }}>
                          <span className={`prd-meta-badge ${activePrd.platform}`}>
                            {activePrd.platform.toUpperCase()}
                          </span>
                          <span className="prd-filename-pill">
                            {activePrd.filename}
                          </span>
                        </div>
                      </div>
                      <div className="walkthrough-body" style={{ overflowY: 'auto' }}>
                        {renderMarkdown(activePrd.content)}
                      </div>
                    </>
                  ) : (
                    <div className="empty-prd-state">
                      <div className="empty-prd-icon" style={{ color: 'var(--accent-indigo)' }}>
                        <IconNeverConnected />
                      </div>
                      <h3>No PRD Selected</h3>
                      <p>Click on any node in the platform architecture flowchart to open and read its requirement PRD document.</p>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            // Tabs 1, 2, 3: Normal walkthrough
            <>
              <div className="walkthrough-header">
                <h2>Detailed Guide</h2>
                <span className="step-badge">STEP 0{activeStep}</span>
              </div>

              <div className="walkthrough-body">
                <div className="walkthrough-title-section">
                  <div className="walkthrough-icon-container" style={{ color: activeTab === 'tab1' ? 'var(--accent-indigo)' : activeTab === 'tab2' ? 'var(--accent-cyan)' : 'var(--accent-rose)' }}>
                    {activeWalkthrough.icon}
                  </div>
                  <div>
                    <span className="walkthrough-stage-tag">{activeWalkthrough.stageTag}</span>
                    <h3 className="walkthrough-title">{activeWalkthrough.title}</h3>
                  </div>
                </div>

                <p className="walkthrough-desc">
                  {activeWalkthrough.description}
                </p>

                <div className="walkthrough-details-box">
                  <h4 className="details-box-header">Under the Hood (Telemetry Details)</h4>
                  <p className="details-box-content">
                    {activeWalkthrough.technicalDetails}
                  </p>
                  
                  <div className="technical-pills">
                    {activeWalkthrough.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-pill">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

      </main>
    </div>

    {/* Hidden print container that renders all 5 steps, each as a page */}
    <div className="print-only-container">
        {Array.from({ length: 5 }).map((_, idx) => {
          const stepNum = idx + 1;
          const stepWalkthrough = walkthroughData[activeTab][stepNum];
          return (
            <div className="print-page" key={stepNum}>
              <div className="print-page-header">
                <h2>
                  {activeTab === 'tab1' 
                    ? 'Endpoint Agent State Workflow' 
                    : activeTab === 'tab2' 
                      ? 'Log Collector Modules Dataflow' 
                      : activeTab === 'tab3'
                        ? 'Kubernetes Cluster Attack Vectors'
                        : 'EDR Requirement PRDs Architecture Map'}
                </h2>
                <span className="print-step-badge">PAGE {stepNum} of 5</span>
              </div>
              
              <div className="print-flow-container">
                <ReactFlow
                  nodes={getNodesForStep(stepNum) as Node[]}
                  edges={getEdgesForStep(stepNum) as Edge[]}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.15 }}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  zoomOnScroll={false}
                  panOnDrag={false}
                >
                  <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#cbd5e1" />
                </ReactFlow>
              </div>
              
              <div className="print-walkthrough-box">
                <div className="print-walkthrough-title-section">
                  <span className="print-stage-tag">{stepWalkthrough.stageTag}</span>
                  <h3 className="print-walkthrough-title">{stepWalkthrough.title}</h3>
                </div>
                <p className="print-walkthrough-desc">{stepWalkthrough.description}</p>
                <div className="print-details-box">
                  <strong>Technical Details:</strong> {stepWalkthrough.technicalDetails}
                  <div className="print-tech-pills">
                    {stepWalkthrough.technologies.map((tech, i) => (
                      <span className="print-tech-pill" key={i}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
