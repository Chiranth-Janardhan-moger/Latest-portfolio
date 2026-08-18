import { Project, Experience, BlogPost, Education, MobileApp } from './types';

export const EDUCATION: Education[] = [
  {
    institution: "BMS Institute of Technology and Management",
    degree: "Bachelor of Engineering in Information Science and Engineering",
    gpa: "CGPA: 9.5",
    period: "2023 – 2027",
    logo: "/bmsit-logo.svg"
  },
  {
    institution: "Siddhartha College",
    degree: "Pre-University Course (PUC)",
    gpa: "Percentage: 94.33%",
    period: "2021 – 2023",
    logo: "/siddhartha-logo.svg"
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "hackathon-hacksphere-2024",
    role: "1st Place Winner",
    company: "Hack Sphere 2024",
    dates: "2024",
    desc: "Secured 1st place in Hack Sphere 2024. Designed, engineered, and successfully pitched a functional full-stack solution under strict hackathon time constraints."
  },
  {
    id: "hackathon-hackday-pondy",
    role: "3rd Place (National)",
    company: "HACK $DAY Pondy (Edition 1 SMVEC)",
    dates: "2024",
    desc: "Placed 3rd out of 626+ teams nationally. Recognized for designing and presenting an innovative system solution in a high-intensity hackathon setting.",
    url: "https://smvec.ac.in/event/hack-day-pondy-edition-1-smvec/"
  },
  {
    id: "hackathon-anveshana-2025",
    role: "Top 8 Finalist (National)",
    company: "Anveshana 2025",
    dates: "2025",
    desc: "Ranked in the Top 8 out of 900+ competing teams nationally, showcasing advanced engineering concepts and working hardware/software prototypes to research and industry panels."
  },
  {
    id: "freelance-optify",
    role: "Optify",
    dates: "2025 – 2026",
    desc: "Full-Stack Development & Real-World Problem Solving",
    logo: "/optify.png"
  },
  {
    id: "freelance-sarvagya-nirakar",
    role: "Sarvagya Nirakar",
    dates: "Jul 2025 – Oct 2025",
    desc: "AI Engineer",
    logo: "/sarvagya-nirakar.png",
    certificate: "Certificate"
  },
  {
    id: "freelance-gaotek",
    role: "GAO Tek Inc.",
    dates: "Mar 2025 – Jun 2025",
    desc: "Web Development",
    logo: "/gaotek-logo.png",
    certificate: "Certificate"
  },
  {
    id: "freelance-aigle-air",
    role: "Aigle Air",
    dates: "2024 – 2025",
    desc: "Web Development + Sensor Architecture",
    logo: "/aigle-logo.png"
  },
  {
    id: "president-epoch",
    role: "President",
    company: "Epoch Society",
    dates: "2025 – 2026",
    desc: "Leading technical operations, organizing bootcamps and hackathons for 500+ student developers. Bridging industry engineers and students to collaborate on production-ready systems.",
    url: "https://bmsit.ac.in/pdfs/students-club-29.pdf",
    logo: "/epoch-society.png"
  },
  {
    id: "vp-coding",
    role: "Vice President",
    company: "Coding Club BMSIT",
    dates: "Apr 2025 – Nov 2025",
    desc: "Spearheaded student-led developer mentorship initiatives, mentored juniors in data structures & algorithms, and managed event coordination. Developed key leadership and management skills while scaling the peer developer community."
  },
  {
    id: "vice-head-events-coding",
    role: "Vice Head of Events",
    company: "Coding Club BMSIT",
    dates: "Sep 2024 – Apr 2025",
    desc: "Coordinated and executed multiple coding events, tech speaker sessions, and department-wide challenges. Enhanced self-confidence and communication skills through active community outreach and peer collaboration."
  }
];

export const PROJECTS: Project[] = [
  {
    id: "connectme",
    name: "ConnectMe",
    meta: "real-time transit · React Native",
    desc: "A campus transit management and real-time shuttle tracking application for BMSIT. Features live map locations, delay predictions, and push notification updates.",
    stack: ["React Native", "Expo", "Node.js", "Express", "Socket.IO", "MongoDB", "Redis"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/Connect_Me",
    demoUrl: "#",
    logs: [
      { type: "VERIFIED", text: "React Native frontend with interactive map-based location tracking and live Socket.io ETA updates" },
      { type: "VERIFIED", text: "Robust Node.js backend utilizing MongoDB Atlas and Upstash Redis for high-speed coordinate caching" },
      { type: "VERIFIED", text: "Integrated Expo Push Notifications and Firebase Admin SDK for system alerts and status shifts" }
    ]
  },
  {
    id: "silent-cry",
    name: "Silent Cry Decoder",
    meta: "applied ML · PyTorch",
    desc: "An acoustic infant cry diagnostic classifier utilizing a hybrid 3-stream feature fusion neural network to classify cry drivers (hunger, pain, fatigue, discomfort, burping).",
    stack: ["PyTorch", "Python", "FastAPI", "OpenAI Whisper", "EfficientNet-B0", "Librosa", "PWA"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/The-Silent-Cry-Decoder",
    demoUrl: "#",
    logs: [
      { type: "VERIFIED", text: "3-stream architecture combining Mel-spectrogram CNN, handcrafted BiLSTM sequence attention, and Whisper SSL semantic features" },
      { type: "VERIFIED", text: "FastAPI inference microservice featuring async singleton loading and GPU-accelerated processing" },
      { type: "VERIFIED", text: "84% overall classification accuracy reported with transparent documentation of minority class underperformance" }
    ]
  },
  {
    id: "sqlguardjs",
    name: "SQLGuardJS",
    meta: "security middleware · npm",
    desc: "An advanced heuristic protection and request-scanning middleware for Express to dynamically shield applications from SQL injection, NoSQL bypasses, and XSS.",
    stack: ["Node.js", "Express", "npm", "TypeScript", "Python", "TensorFlow"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/sqlguardjs",
    demoUrl: "https://www.npmjs.com/package/sqlguardjs",
    logs: [
      { type: "VERIFIED", text: "Published to npm registry with fully documented OWASP-mapped detector APIs and CI integration examples" },
      { type: "VERIFIED", text: "Includes a Python reference detector package built with TensorFlow/Keras and FastAPI endpoints" },
      { type: "FLAGGED", text: "Documented edge-case heuristic bypasses (versioned comment splitting, SVG script payloads) in the README" }
    ]
  },
  {
    id: "mcppro",
    name: "MCPPro",
    meta: "AI agent orchestrator · RAG",
    desc: "A production-grade AI agent and Document RAG orchestration platform featuring a decoupled orchestrator and custom Model Context Protocol (MCP) server integration.",
    stack: ["Next.js", "FastAPI", "MCP", "Qdrant", "Supabase", "BGE-M3", "TypeScript", "Python"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/MCPPRO",
    demoUrl: "#",
    logs: [
      { type: "VERIFIED", text: "Next.js 14 API routes coordinating multi-agent actions via custom MCP client managers" },
      { type: "VERIFIED", text: "FastAPI document intelligence pipeline running BGE-M3 embeddings and OCR extraction" },
      { type: "VERIFIED", text: "Supabase transactional storage mapped alongside Qdrant and Pinecone vector databases" }
    ]
  },
  {
    id: "visiontraffic",
    name: "VisionTraffic",
    meta: "computer vision",
    desc: "A real-time traffic density analyzer and vehicle tracking system designed for municipal CCTV stream analysis.",
    stack: ["YOLOv8", "ByteTrack", "OpenCV", "Python"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/visiontraffic",
    demoUrl: "#",
    logs: [
      { type: "VERIFIED", text: "Detection + multi-object tracking pipeline running stably at 30+ frames per second on consumer-grade edge hardware" }
    ]
  },
  {
    id: "cloudpulse",
    name: "CloudPulse Monitor",
    meta: "cloud engineering · AWS · devops",
    desc: "A real-time AWS EC2 instance monitoring and cost optimization platform. Automatically scans and reports idle resources to estimate cost waste across multiple accounts.",
    stack: ["React 19", "TypeScript", "Node.js", "Express", "AWS SDK", "Docker"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/CloudPulse",
    demoUrl: "https://github.com/Chiranth-Janardhan-moger?tab=packages&repo_name=CloudPulse",
    logs: [
      { type: "VERIFIED", text: "Parallel multi-region AWS EC2 resource scanning with automated updates every 30 seconds" },
      { type: "VERIFIED", text: "Cost waste estimation and idle instance detection mapped through CloudWatch CPU metrics" },
      { type: "VERIFIED", text: "Multi-account switching panel with secure profile management and local storage credentials" }
    ]
  },
  {
    id: "latex-editor",
    name: "Latex Editor",
    meta: "mobile tools · Kotlin",
    desc: "A high-performance LaTeX editor and local compiler for Android powered by a native port of the Tectonic typesetting engine.",
    stack: ["Kotlin", "Jetpack Compose", "Tectonic Engine", "JNI", "Android Studio"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/latex-editor-android",
    demoUrl: "#",
    appDeepLink: "/app/latex",
    logs: [
      { type: "VERIFIED", text: "100% offline compilation and PDF generation utilizing a native port of the Tectonic engine via JNI" },
      { type: "VERIFIED", text: "Smooth syntax-highlighting engine and custom console compile logger built with Jetpack Compose" }
    ]
  },
  {
    id: "vaultx",
    name: "VaultX Password Manager",
    meta: "mobile security · React Native",
    desc: "A military-grade offline-first password manager built with React Native. Guarantees zero-network access privacy with AES-256 and PBKDF2 derivation.",
    stack: ["React Native", "Expo", "Expo Router", "AES-256", "PBKDF2", "Autofill API"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/vaultx-offline-password-manager",
    demoUrl: "https://chiranth-janardhan-moger.github.io/vaultx-offline-password-manager/",
    appDeepLink: "/app/vaultx",
    logs: [
      { type: "VERIFIED", text: "Native Android Autofill Integration allowing safe, seamless credential insertion inside external applications" },
      { type: "VERIFIED", text: "Built-in 2FA/TOTP authenticator, clipboard clearing safety monitoring, and screenshot prevention overlays" }
    ]
  },
  {
    id: "surplus2serve",
    name: "Surplus2Serve",
    meta: "full-stack · social impact",
    desc: "A real-time coordination portal designed to connect retail food donors with nearest verified community kitchens and shelters.",
    stack: ["React", "Node.js", "Express", "MySQL", "OpenCage API", "Twilio API"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/Surplus2serve",
    demoUrl: "#",
    logs: [
      { type: "VERIFIED", text: "Pooled MySQL connection database design mapping food donors to community shelters" },
      { type: "VERIFIED", text: "Integrated Twilio SMS notifications and OpenCage reverse geocoding API for exact location mapping" }
    ]
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Next Shift in AI: Building Context-Aware Agents with Model Context Protocol (MCP)",
    slug: "ai-agents-model-context-protocol",
    summary: "An exploration of Model Context Protocol (MCP), why it is replacing static API boundaries for LLMs, and how we built the orchestration pipeline for MCPPro.",
    category: "AI Engineering",
    publishedAt: "2026-07-15",
    readingTime: "6 min read",
    tags: ["Artificial Intelligence", "Model Context Protocol", "Next.js", "RAG", "Qdrant"],
    content: `Large Language Models are incredibly capable, but they are traditionally trapped in static environments. To do meaningful work, they need tools, data repositories, and secure integration pathways. In building **MCPPro**, we addressed this exact challenge by adopting the newly standardized **Model Context Protocol (MCP)**.

### Beyond Custom API Wrappers

Before MCP, developers built custom, ad-hoc API integrations for every unique environment. If you wanted an AI agent to read a PostgreSQL table, compile a folder, or query a search index, you wrote custom endpoint bridges. 

Model Context Protocol standardizes this interaction. An agent simply establishes a client connection to an MCP server, queries the available schemas, and executes tools using a unified protocol schema.

### Designing the MCPPro Pipeline

In the MCPPro intelligence platform, we decoupled the execution pipeline into two core systems:

1. **Agent Orchestration**: Next.js 14 API routes coordinate agent tasks, managing sessions and coordinating server client interfaces.
2. **Context Enrichment (RAG)**: A FastAPI pipeline processes documents using BGE-M3 text embeddings, loading parsed information into Qdrant vector databases for fast semantic search.

By integrating the Model Context Protocol, the AI agents can dynamically discover and query these data sources. The result is a highly extensible, modular environment where connecting a new database or tool takes minutes, not days. We are moving toward a future where models collaborate seamlessly with existing software stacks.`
  },
  {
    id: "blog-2",
    title: "Running Rust at 60 FPS: Porting the Tectonic LaTeX Engine to Android via JNI",
    slug: "tectonic-latex-android-jni",
    summary: "Inside the systems-engineering challenges of porting a Rust-based LaTeX compiler to compile documents 100% offline inside a mobile Jetpack Compose app.",
    category: "Systems Engineering",
    publishedAt: "2026-06-18",
    readingTime: "8 min read",
    tags: ["Android", "Kotlin", "Rust", "JNI", "LaTeX", "Jetpack Compose"],
    content: `There is a unique satisfaction in compiling complex documents on the go. But running standard LaTeX engines like pdflatex on a mobile device is notoriously difficult due to size constraints, complex font mappings, and massive asset trees.

To make offline LaTeX editing a reality on Android, we ported the **Tectonic typesetting engine** (written in Rust) directly into a native Kotlin application.

### The System Challenges of Mobile Compilation

Android's sandboxed environment prevents executing arbitrary compiler processes easily. Additionally, traditional TeX distributions exceed 2GB in size. Tectonic solves this by downloading assets on-demand and caching them locally. To make it work 100% offline:

1. **Cross-Compiling to Android Targets**: We configured Rust target architectures (\`aarch64-linux-android\` and \`x86_64-linux-android\`) using the Android NDK.
2. **Java Native Interface (JNI) Bridge**: Instead of calling a standalone binary using ProcessBuilder (which is slow and restricted on modern Android), we wrapped the Tectonic engine as a dynamic library (\`.so\`) and exposed it via JNI.

### Creating a Real-Time Logs UI

To keep the editing experience responsive, we linked the compilation stdout streams directly to a Jetpack Compose state emitter. As the Rust compiler runs, log outputs stream directly into a custom terminal view at a buttery-smooth 60 frames per second. 

Offline document compilation now completes in under two seconds, showing that high-performance systems utilities written in systems languages like Rust can run beautifully on modern mobile operating systems.`
  },
  {
    id: "blog-3",
    title: "SQLGuardJS: A Heuristic Web Application Firewall (WAF) Middleware for Express",
    slug: "sqlguardjs-waf-middleware-express",
    summary: "Inside the development of our open-source request verification WAF middleware to shield Express gateways from SQLi, XSS, and NoSQL injection vulnerabilities.",
    category: "Cybersecurity",
    publishedAt: "2026-05-20",
    readingTime: "7 min read",
    tags: ["Cybersecurity", "Node.js", "Express", "npm", "AppSec"],
    content: `Securing web applications requires proactive verification at the entry gateway. To address common injection flaws in Node.js applications, we built and published **SQLGuardJS**, a lightweight, signature-based Web Application Firewall (WAF) middleware designed specifically for the Express framework.

### Middleware Core Architecture

SQLGuardJS intercepts incoming HTTP requests (bodies, query parameters, paths, and optionally headers or cookies) and inspects them against predefined heuristic pattern matrices before they can resolve in your controller routes.

Below is the standard configuration schema exposed by the library:

| Configuration Parameter | Data Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| \`mode\` | \`"block" | "log"\` | \`"block"\` | Defense behavior: \`"block"\` rejects attacks with 403 Forbidden; \`"log"\` monitors and alerts only. |
| \`level\` | \`"low" | "balanced" | "high"\` | \`"balanced"\` | Detection depth: Low limits signature scanning; High implements strict, sensitive heuristic rules. |
| \`logRequests\` | \`boolean\` | \`true\` | Enters general request metadata into the in-memory log buffer. |
| \`maxLogs\` | \`number\` | \`100\` | Limits the circular log queue size to maintain low memory footprints. |
| \`scanHeaders\` | \`boolean\` | \`false\` | Inspects HTTP header payloads (like User-Agent or Referer) for attack scripts. |
| \`scanCookies\` | \`boolean\` | \`false\` | Scans cookie payload structures for query operations. |
| \`logAttacks\` | \`function\` | \`undefined\` | Optional custom event handler callback executed when a signature matches. |

### Heuristic Detection Vector Matrix

The package provides defensive filters mapped to common OWASP vulnerabilities:

| Attack Category | Threat Type | Signature Pattern Heuristics |
| :--- | :--- | :--- |
| **SQL Injection (SQLi)** | Tautologies, Comments, Union Bypass | Detects SQL tokens like \`' OR '1'='1\`, Postgres/MySQL comments (\`--\`, \`/*\`), and \`UNION SELECT\` statements. |
| **Cross-Site Scripting (XSS)** | Script Injection, Inline Elements | Identifies HTML elements (\`<script>\`), inline event handlers (\`onload=\`, \`onerror=\`), and \`javascript:\` URIs. |
| **NoSQL Injection** | Operator Bypass, Logic Manipulation | Blocks MongoDB operators like \`$ne\`, \`$gt\`, \`$where\`, and logical comparisons within JSON payloads. |

### Integration Quick Start

To secure your Express routing pipeline:

\`\`\`javascript
const express = require('express');
const { sqlguardjs } = require('sqlguardjs');

const app = express();
const guard = sqlguardjs({
  mode: "block",
  level: "balanced",
  logRequests: true
});

// Register WAF globally
app.use(guard.global());
\`\`\`

By deploying a heuristic defensive layout, applications can filter out the vast majority of script-injected crawler scans before they reach business logic layers. True security is multi-layered, and SQLGuardJS serves as the first line of defense.`
  },
  {
    id: "blog-4",
    title: "Kalman Filtering for GPS Jitter in Mobile App Development",
    slug: "kalman-filtering-gps-jitter",
    summary: "How we implemented real-time location smoothing in the ConnectMe bus tracking system to prevent jumps and erratic animations.",
    category: "Systems Engineering",
    publishedAt: "2026-04-10",
    readingTime: "6 min read",
    tags: ["Systems", "GPS", "Algorithms", "React Native"],
    content: `In building **ConnectMe**, our real-time campus bus tracker, we faced a major user experience obstacle: erratic bus avatars.

On the client map, the bus would frequently teleport 50 meters into a neighboring building, freeze, and then zoom back to the road. This wasn't because the bus driver was off-roading; it was the result of GPS multipath interference from tall concrete campus buildings combined with network packet latency.

To solve this, we turned to a mathematical classic: the **Kalman Filter**.

### How a Kalman Filter Works

A Kalman Filter works in a two-step cycle: **Predict** and **Update**.

1. **Predict**: Based on the vehicle's last known position, velocity, and time elapsed, we calculate an estimate of where the bus *should* be right now.
2. **Update**: When we get a new GPS packet, we compare it with our prediction. The filter assigns a "gain" (weight) to both the prediction and the new measurement based on their estimated uncertainties.

If the new GPS measurement says the bus suddenly teleported 50 meters sideways in 0.5 seconds, the filter recognizes this as highly improbable given the laws of physics (momentum), heavily discounts the noisy measurement, and smooths the avatar's transition.

### On-Device vs. Server Smoothing

We initially ran the Kalman Filter on the Express backend server before sending coordinates to Redis. However, we realized that streaming raw, noisy coordinates at 1Hz from multiple buses occupied unnecessary network bandwidth.

By moving the Kalman filter calculation onto the tracking device itself (using a lightweight mobile utility) and only transmitting smoothed coordinates when they drifted more than 2 meters from the prior smoothed position, we reduced server packet ingress by **38%** while providing a buttery-smooth map experience.

Read more in our [complete ConnectMe mobile repository documentation](https://github.com/Chiranth-Janardhan-moger/Connect_Me).`
  }
];

export const MOBILE_APPS: MobileApp[] = [
  {
    id: "vaultx",
    name: "VaultX",
    category: "Security & Cryptography",
    tagline: "Offline-First Android App Locker & Password Vault",
    desc: "A zero-knowledge, offline-first mobile password manager and credential vault. Implements military-grade AES-256-GCM encryption with PBKDF2 key derivation, biometric authentication, and hardware-backed SecureStore keys. Zero internet permissions requested, ensuring total isolation from network attack vectors.",
    detailedAbout: "VaultX is an open-source, privacy-first mobile password manager and secure wallet engineered with React Native and Expo. Your credentials never touch third-party servers, never synchronize to the cloud, and are protected with military-grade AES-256 authenticated encryption. Features include biometric authentication, built-in 2FA/TOTP authenticator generation, secure identity & payment card storage, native Android Autofill integration, and deterministic master password generation.",
    problemStatement: "Mainstream password managers synchronize vault databases across remote centralized servers. When cloud providers suffer breaches, credential stuffing attacks, or subpoena seizures, user master hashes and encrypted vaults are exposed. Furthermore, many proprietary apps require recurring paid subscriptions, harvest telemetry logs, and expose users to server-side outage lockouts.",
    solutionStatement: "VaultX enforces a strict 100% air-gapped, zero-network architecture by stripping all internet permissions from the Android manifest. The vault uses military-grade AES-256-GCM authenticated encryption paired with PBKDF2 (100,000 salt rounds) and hardware-isolated SecureStore keys. It includes biometric biometric lockouts, built-in offline 2FA/TOTP authenticator code generation, and auto-clearing clipboard watchers.",
    solutionPoints: [
      "Zero-Network Attack Surface: Stripped all internet permissions from the Android manifest, ensuring 100% air-gapped data persistence.",
      "Client-Side Authenticated Encryption: Implemented military-grade AES-256-GCM encryption paired with PBKDF2 (100,000 salt iterations).",
      "Hardware-Isolated Key Storage: Vault keys derived and protected inside hardware-backed SecureStore with zero plaintext memory leaks.",
      "Biometric & Intruder Defense: Hardware biometric authentication with automatic front-camera intruder capture upon failed PIN attempts.",
      "Built-in 2FA/TOTP Engine: Offline local HMAC-SHA1 generation with active clipboard auto-wipe watchers after 30 seconds."
    ],
    stack: ["React Native 0.74", "Expo 52", "TypeScript", "AES-256-GCM", "PBKDF2", "Biometrics", "SecureStore", "Reanimated 4"],
    iconUrl: "/vaultx-icon.png",
    screenshots: [
      "https://github.com/user-attachments/assets/edabb54a-0e75-4449-ad95-3d84bbca057f",
      "https://github.com/user-attachments/assets/a8ab23da-3adf-43d3-9fbc-1d8101ab833a"
    ],
    features: [
      "Military-grade AES-256 Encryption & PBKDF2 Key Derivation with salt",
      "100% Offline with Zero Network Permissions (No Cloud Dependency / Zero Backend)",
      "Hardware Biometric Authentication (Fingerprint & Face ID) + 6-Digit PIN Lock",
      "Built-in 2FA / TOTP Authenticator (Local HMAC-SHA1 generation from Base32 secrets)",
      "Identity & Payment Cards Wallet (Passports, Driving Licenses, IDs, Credit/Debit Cards)",
      "Native Android Autofill Integration to autofill logins in other apps and browsers",
      "Deterministic Master Password System (Regenerate strong passwords consistently)",
      "Screenshot Protection, Auto-Lockout Protection & Clipboard Monitor (Auto-wipe in 30s)",
      "Smart Auto-Categorization (Google, Banking, Social Media, Shopping, Gaming, Work)"
    ],
    status: "Live Release",
    version: "v1.3.4",
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/vaultx-offline-password-manager",
    apkUrl: "https://github.com/Chiranth-Janardhan-moger/vaultx-offline-password-manager/releases/download/v1.3.4/VaultX-v1.3.4-arm64-v8a.apk",
    architectureHighlights: [
      "Key derivation using PBKDF2 with SHA-256 and 100,000 iterations",
      "Transient memory buffers with automated zero-fill garbage collection",
      "60 FPS smooth micro-interactions powered by React Native Reanimated v4",
      "Tamper-resistant SQLite encrypted key-value storage engine"
    ],
    screenMockups: [
      {
        id: "v-screen-1",
        title: "Biometric & Master PIN Shield",
        description: "Hardware-level biometric verification and single-digit focused 6-digit cryptographic PIN pad.",
        type: "pin"
      },
      {
        id: "v-screen-2",
        title: "Categorized Encrypted Vault",
        description: "Zero-plaintext item browser with service-specific branding icons, quick copy, and strength audit metrics.",
        type: "vault"
      },
      {
        id: "v-screen-3",
        title: "Offline 2FA / TOTP Authenticator",
        description: "Native offline Time-based One-Time Password generator with animated circular sync indicators.",
        type: "totp"
      }
    ]
  },
  {
    id: "connectme",
    name: "ConnectMe",
    category: "Transit Telemetry & Mapping",
    tagline: "Real-Time Campus Bus Tracking & ETA Prediction",
    desc: "A real-time transit telemetry mobile app engineered for university shuttle tracking. Overcomes urban GPS multipath jitter using on-device Kalman filtering algorithms, coupled with live WebSockets for sub-second bus coordinate updates.",
    detailedAbout: "ConnectMe was architected to eliminate transit uncertainty across the university campus. Designed as a comprehensive client-server ecosystem, the mobile app connects students with campus shuttle telemetry in real time. It calculates accurate arrival times based on historical transit segment speeds, traffic conditions, and campus perimeter geofences.",
    problemStatement: "University students and faculty lost hours every week waiting for campus shuttles with unpredictable schedules. Standard GPS tracking suffered severe multipath reflections from concrete academic buildings, causing tracking bus icons to jitter erratically across map tiles, teleport across blocks, and miscalculate arrival ETAs.",
    solutionStatement: "Engineered an on-device mathematical Kalman filter that predicts expected vehicle momentum and discounts noisy GPS telemetry anomalies. Position updates are streamed through lightweight Socket.io rooms directly to Upstash Redis geospatial clusters, reducing server packet ingress by 38% while delivering a smooth 60 FPS bus avatar animation.",
    solutionPoints: [
      "On-Device Kalman Filtering: Mathematical trajectory smoothing predicting momentum and discounting GPS reflections.",
      "Sub-Second Bidirectional Telemetry: Live position coordinates streamed via Socket.io to Upstash Redis geospatial clusters.",
      "Dynamic Arrival ETA Engine: Automated arrival forecasting calculated from real-time speed profiles and route geofences.",
      "38% Ingress Compression: On-device coordinate delta filtering preventing redundant server database writes.",
      "Resilient Offline Mode: Local SQLite timetable caching enabling full route navigation during cellular drops."
    ],
    stack: ["React Native", "Expo", "Socket.IO", "Redis Geo", "Leaflet / Mapbox", "Node.js", "Express", "TypeScript"],
    iconUrl: "/bus-icon.webp",
    features: [
      "Live GPS telemetry with on-device Kalman filter motion smoothing",
      "Sub-second bus avatar sync via Socket.io bidirectional channels",
      "Automated ETA prediction based on dynamic route speed profiling",
      "Geofenced arrival alerts and push notifications via Expo Push & Firebase",
      "Offline timetable caching and fallback route navigation schedules",
      "Driver dispatch telemetry console with live route adherence metrics"
    ],
    status: "Production",
    version: "v2.1.0",
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/Connect_Me",
    architectureHighlights: [
      "Upstash Redis geospatial indexing (GEOADD & GEORADIUS query engine)",
      "38% reduction in packet ingress through on-device telemetry compression",
      "Graceful offline degradation with local SQLite schedule caches",
      "Dynamic connection reconnect with exponential backoff on cell drops"
    ]
  },
  {
    id: "latex-editor",
    name: "LaTeX Editor",
    category: "Academic & Developer Tools",
    tagline: "Native Tectonic Typesetting & Offline PDF Compiler",
    desc: "A blazing fast LaTeX editor and compiler built specifically for Android. Powered by a native port of the Tectonic typesetting engine, delivering zero-lag document authoring and instant local PDF generation with 100% offline compilation.",
    detailedAbout: "LaTeX Editor bridges desktop-grade typesetting power to mobile devices. Built natively with Kotlin and modern Android architecture, the application integrates an embedded native port of the Tectonic TeX engine (cross-compiled via Android NDK). Unlike conventional mobile LaTeX tools that upload sensitive research or exam papers to slow cloud servers, LaTeX Editor compiles documents entirely on-device with zero network requests, complete TeX package bundling, live AST-backed syntax highlighting, and instantaneous vector PDF rendering.",
    problemStatement: "Most existing Android LaTeX editors rely heavily on remote cloud compilation backends, resulting in 5–15 second latency per compile, broken workflows during connectivity drops, and privacy vulnerabilities when authoring proprietary research papers, confidential thesis drafts, or math notes.",
    solutionStatement: "Integrated an embedded native build of the Tectonic engine directly into the Android runtime, eliminating all network dependency. Engineered a high-throughput, AST-driven token parser for zero-lag syntax highlighting and hot-reload PDF preview buffers.",
    solutionPoints: [
      "100% On-Device Compilation: Native Tectonic typesetting engine port runs locally without cloud latency or data transmission.",
      "Zero-Lag Syntax Engine: Custom token highlighting parser optimized for complex, multi-thousand line .tex documents.",
      "Local TeX Bundle & Font Sandbox: Automated dependency caching for AMS-LaTeX, TikZ, and custom font packages.",
      "Real-Time PDF Hot Reload: Instantaneous vector rendering with synchronization between source lines and PDF viewports.",
      "Distraction-Free Touch UI: Formula snippet shortcuts, auto-closing math delimiters, and clean dark/light themes."
    ],
    stack: ["Kotlin", "Android SDK", "Jetpack Compose", "Tectonic Engine (Rust)", "Android NDK / JNI", "TeX / PDF Rendering"],
    iconUrl: "/latex-icon.svg",
    screenshots: [
      "/latex-editor-screenshot.png",
      "/latex-console-screenshot.png"
    ],
    features: [
      "100% Offline TeX Compilation (No internet connection or cloud server required)",
      "Embedded Native Tectonic Typesetting Engine cross-compiled for ARM64 & x86_64",
      "High-Performance Syntax Highlighting with token parsing for large .tex files",
      "Instant Vector PDF Preview with pinch-to-zoom and hot-reload buffer sync",
      "Custom Math Keyboard & Quick Snippet Toolbar (\\frac, \\sum, \\int, \\matrix, Greek symbols)",
      "Auto-closing math delimiters ($, $$, \\{ \\}, \\begin...\\end)",
      "Local TeX Package & Font Cache Manager for standalone document portability",
      "Export & Share high-resolution printable PDF and source .tex archives"
    ],
    status: "Production",
    version: "v1.0.0",
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/latex-editor-android",
    apkUrl: "https://github.com/Chiranth-Janardhan-moger/latex-editor-android/releases/download/v1.0.0/app-arm64-v8a-release.apk",
    architectureHighlights: [
      "Embedded Rust Tectonic engine cross-compiled for ARM64 via Android NDK",
      "Zero-copy memory mapped buffers for lightning-fast on-device PDF generation",
      "AST-driven syntax highlighter with incremental delta parsing",
      "Sandboxed local TeX bundle package repository"
    ]
  }
];


