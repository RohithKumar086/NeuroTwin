# 🧠 NeuroTwin — AI-Powered Neural Digital Twin Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Cytoscape](https://img.shields.io/badge/Cytoscape.js-Graph_Engine-orange?style=for-the-badge)](https://js.cytoscape.org/)
[![Apache ECharts](https://img.shields.io/badge/Apache_ECharts-Data_Viz-red?style=for-the-badge&logo=apache-echarts)](https://echarts.apache.org/)

> **NeuroTwin** is a state-of-the-art industrial Digital Twin platform powered by **Spatio-Temporal Graph Neural Networks (ST-GNNs)**. It mirrors complex manufacturing facilities as dynamic, interdependent topological graphs—predicting critical component degradation, tracking cascading anomalies, and stress-testing operational resilience through real-time "What-If" simulations.

---

## ⚡ System Architecture & AI Pipeline

NeuroTwin models industrial systems not as isolated machines, but as a living, interconnected physical-neural continuum. Sensor telemetry flows continuously through temporal feature extractors, spatial message-passing layers, and predictive heads.

```mermaid
flowchart TD
    subgraph SENSORS["1. Real-World Telemetry & IoT Layer"]
        S1["🌡️ Vibration & Thermal Sensors"]
        S2["⚡ Power & Current Transducers"]
        S3["🌀 Pressure & Flow Monitors"]
        S4["⚙️ RPM & Encoder Signals"]
    end

    subgraph PIPELINE["2. Ingestion & Stream Processing"]
        P1["Kafka / MQTT Edge Broker"]
        P2["Time-Series Windowing & Normalization"]
        P3["Adjacency & Physical Coupling Matrix"]
    end

    subgraph NEURAL["3. Spatio-Temporal Graph Neural Network (ST-GNN)"]
        G1["Spatial Layer: Multi-Head GATv2 Attention"]
        G2["Temporal Layer: Dilated Causal Convolutions / GRU"]
        G3["Graph Pooling & Latent State Representation"]
    end

    subgraph INFERENCE["4. AI Inference & Prediction Heads"]
        I1["🔮 RUL & Health Horizon Forecasting"]
        I2["🚨 Anomaly Detection & Isolation (Isolation Forest + AutoEncoder)"]
        I3["💥 Cascade Failure Propagation Engine"]
    end

    subgraph TWIN["5. NeuroTwin Interactive Interface"]
        UI1["🌐 Cytoscape Dynamic Topology Canvas"]
        UI2["🧪 Real-time What-If Counterfactual Sandbox"]
        UI3["📊 ECharts Multi-Metric Diagnostic Analytics"]
        UI4["🔔 Autonomous Alert & Root-Cause Attribution"]
    end

    S1 & S2 & S3 & S4 --> P1
    P1 --> P2 & P3
    P2 & P3 --> G1
    G1 <--> G2
    G2 --> G3
    G3 --> I1 & I2 & I3
    I1 & I2 & I3 --> UI1 & UI2 & UI3 & UI4
```

---

## 🏭 Plant Topology & Dependency Graph

In the simulated smart manufacturing plant, each node represents a mission-critical asset, while edges represent physical mass flow, electrical distribution, or kinetic coupling:

```
[ Power Grid Substation (PU-01) ]
         │
         ├───▶ [ Main Drive Motor (MTR-01) ] ────▶ [ Primary Compressor (CMP-01) ]
         │              │                                     │
         │              ▼                                     ▼
         │     [ Coolant Pump (PMP-01) ] ──────────▶ [ Closed-Loop Chiller (COL-01) ]
         │              │                                     │
         ▼              ▼                                     ▼
 [ CNC Milling Cell (MCH-01) ] ───────────────▶ [ Automated Assembly Line (LNE-01) ]
         ▲                                                    ▲
         │                                                    │
 [ Hydraulic Press (MCH-02) ] ────────────────────────────────┘
```

### Edge Dynamics:
- **Mass / Thermal Coupling**: Increased temperature in `MTR-01` alters viscosity and thermal load into `COL-01`.
- **Pressure Coupling**: Drop in `CMP-01` pressure creates pneumatic starvation downstream in `LNE-01`.
- **Cascade Factor**: GNN edge weights adapt dynamically based on mutual influence and learned cross-sensor correlations.

---

## 🔬 Core Features & Interactive Capabilities

### 1. 🌐 Real-Time Neural Digital Twin Topology
- **Interactive Graph Canvas**: Rendered via Cytoscape with hardware-accelerated Bezier curves, status-coded aura pulses, and directional animated particle flow.
- **Deep Node Inspection**: Click any component to reveal full dynamic telemetry (temperature, pressure, vibration, load, RPM, kW), maintenance schedules, and upstream/downstream blast radius.
- **Cluster & System Filtering**: Instant filtering by status (Healthy, Warning, Critical, Offline) and equipment class.

### 2. 🧪 "What-If" Counterfactual Simulation Engine
Simulate real-world industrial stress scenarios before executing physical adjustments:
- **Parameter Override Sandbox**: Artificially spike thermal load, throttle pump RPM, or sever power lines.
- **Cascade Failure Modeling**: Watch failure waves propagate through the graph in step-by-step slow motion, showing propagation velocity, secondary risk zones, and expected time-to-failure.
- **Comparative Diff Mode**: Side-by-side delta visualization of baseline operational state vs. simulated counterfactual scenario.

### 3. 🔮 Multi-Horizon Predictive Analytics
- **Forecasting Horizons**: Predict component states at **+15m, +1h, +6h, +24h, and +7d**.
- **Probabilistic Confidence Intervals**: Dual-band confidence intervals (p10, p50, p90) highlighting sensor uncertainty.
- **Remaining Useful Life (RUL)**: Continuous degradation curve estimation and predictive maintenance triggers.

### 4. 🚨 Intelligent Anomaly Detection & Root-Cause Attribution
- **Multi-Sensor Autoencoder Reconstruction**: Detect subtle micro-drifts before traditional hard thresholds trigger.
- **Root-Cause Attribution Graph**: Directly identifies whether an anomaly is locally generated or imported from an upstream dependency.
- **Explainable AI (XAI)**: Feature contribution breakdown (SHAP-style) pinpointing why the model flagged the asset.

---

## 📐 Spatio-Temporal Graph Neural Network Architecture

```
                    Input Node Features X_t ∈ ℝ^(N × F)
                                   │
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │       Spatial Attention Layer (GATv2 Conv)          │
        │  α_ij = softmax(LeakyReLU(aᵀ [W h_i || W h_j || e_ij])) │
        └─────────────────────────────────────────────────────┘
                                   │
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │      Temporal Convolutional Block (TCN / GRU)       │
        │    Captures multi-scale temporal dependencies & lag │
        └─────────────────────────────────────────────────────┘
                                   │
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │              Latent Graph Embedding                 │
        │          Z = LayerNorm(Spatial ⊕ Temporal)          │
        └─────────────────────────────────────────────────────┘
                   ┌───────────────┼───────────────┐
                   ▼               ▼               ▼
            [State Prediction] [Anomaly Head] [Cascade Matrix]
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/) with Cyber-Industrial Dark Theme |
| **Graph Visualization** | [Cytoscape.js](https://js.cytoscape.org/) + `react-cytoscapejs` |
| **Telemetry Charts** | [Apache ECharts 6](https://echarts.apache.org/) + `echarts-for-react` |
| **Motion & Micro-interactions** | [Framer Motion](https://www.framer.com/motion/) |
| **Iconography** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RohithKumar086/NeuroTwin.git

# Navigate into the project folder
cd NeuroTwin

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the Next.js Turbopack development server |
| `npm run build` | Compiles the production build with type checking |
| `npm run start` | Launches the compiled production application |
| `npm run lint` | Runs ESLint across all TypeScript and TSX sources |

---

## 🗺️ Project Structure

```
NeuroTwin/
├── src/
│   ├── app/                     # Next.js App Router routes
│   │   ├── page.tsx             # Executive Overview & KPI Dashboard
│   │   ├── digital-twin/        # Interactive Digital Twin Live Workspace
│   │   ├── graph/               # System Graph & Dependency Matrix
│   │   ├── predictions/         # Multi-Horizon State Forecasting
│   │   ├── simulation/          # What-If Cascade Simulator
│   │   ├── anomalies/           # Anomaly Detection & Diagnosis
│   │   ├── sensors/             # Real-time Telemetry & Stream Status
│   │   ├── model/               # Neural Network Architecture Specs
│   │   ├── events/              # Alert Center & Audit Trail
│   │   ├── settings/            # System & Simulation Parameters
│   │   └── globals.css          # Cyber-Industrial CSS & Tailwind Theme
│   ├── components/
│   │   ├── dashboard/           # KPI cards, quick view panels
│   │   ├── graph/               # Cytoscape canvas & node detail inspector
│   │   ├── layout/              # Header, Sidebar, Global status bar
│   │   └── ui/                  # Reusable badges, cards, skeleton loaders
│   ├── data/                    # Realistic simulated industrial datasets
│   ├── hooks/                   # System state & telemetry simulation hooks
│   ├── services/                # Graph algorithms & prediction engines
│   └── types/                   # Strict TypeScript schemas & definitions
├── public/                      # Static assets
├── tsconfig.json                # TypeScript configuration with @/* alias
├── package.json                 # Dependencies and build scripts
└── README.md                    # Project documentation
```

---

## 🔮 Production Roadmap

- [ ] **Hardware Bridge**: Native MQTT / OPC-UA / Modbus connector daemon for live factory floor integration.
- [ ] **ONNX Runtime Web**: In-browser edge inference of GNN checkpoints directly via WebGL / WebGPU.
- [ ] **3D Spatial Twin**: WebGL / Three.js 3D facility layout overlay paired with 2D topological graph.
- [ ] **Autonomous Dispatch**: Automated control-loop feedback sending setpoint adjustments back to PLCs upon cascade risk detection.

---

## 📄 License

MIT License © 2026 Rohith Kumar. Built for next-generation industrial intelligence.
