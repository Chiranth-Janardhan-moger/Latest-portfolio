import { Project, Experience, BlogPost } from './types';

export const EDUCATION = [
  {
    institution: "BMS Institute of Technology and Management",
    location: "Bengaluru",
    degree: "Bachelor of Engineering in Information Science and Engineering",
    gpa: "CGPA: 9.5",
    period: "2023 – 2027"
  },
  {
    institution: "Siddhartha College",
    degree: "Pre-University Course (PUC)",
    gpa: "Percentage: 94.33%",
    period: "2021 – 2023"
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
    id: "freelance-client-1",
    role: "Freelance Full-Stack Developer",
    company: "Client 1 — EduManage (Tuition Management Suite)",
    dates: "2024 – 2025",
    desc: "Designed and engineered school management portals and student attendance/schedules trackers. Built EduManage, a production-ready React Native + Node.js fee and attendance administration application. Features a multi-role dashboard (Admin, Parent, Developer), smart joining-date-based fee cycles, leave application approvals, Socket.io real-time chat, feature toggles, and direct APK auto-updates with download resumption. Reduced load times by 60% and memory by 40% (handles 500+ active students).",
    links: [
      { label: "EduManage Repo", url: "https://github.com/Chiranth-Janardhan-moger/tuition-app" },
      { label: "I-School Repo", url: "https://github.com/Chiranth-Janardhan-moger/Client-1-I-School" },
      { label: "Live I-School App", url: "https://i-school-website.vercel.app/" }
    ]
  },
  {
    id: "freelance-client-2",
    role: "Freelance Full-Stack Developer",
    company: "Client 2 — dSK Mart (E-Commerce & Delivery Ecosystem)",
    dates: "2025 – 2026",
    desc: "Architected dSK Mart, a multi-platform e-commerce ecosystem consisting of a customer shopping portal and admin panel (React + Vite + TypeScript + Tailwind CSS), a delivery boy mobile app (React Native + Expo with QR scanning and location telemetry), and a backend REST API (Express + MongoDB Atlas).",
    links: [
      { label: "Admin Console Repo", url: "https://github.com/Chiranth-Janardhan-moger/Client-2_DSK_MART" },
      { label: "Feedback Service Repo", url: "https://github.com/Chiranth-Janardhan-moger/feedback_dsk_mart" }
    ]
  },
  {
    id: "president-epoch",
    role: "President, Epoch Society",
    company: "BMSIT Technical Society",
    dates: "2025 – Present",
    desc: "Leading technical operations, organizing bootcamps and hackathons for 500+ student developers. Bridging industry engineers and students to collaborate on production-ready systems.",
    url: "https://bmsit.ac.in/pdfs/students-club-29.pdf"
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
    name: "MCPPro Intelligence System",
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
    name: "Latex Android Editor",
    meta: "mobile tools · Kotlin",
    desc: "A high-performance LaTeX editor and local compiler for Android powered by a native port of the Tectonic typesetting engine.",
    stack: ["Kotlin", "Jetpack Compose", "Tectonic Engine", "JNI", "Android Studio"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/latex-editor-android",
    demoUrl: "#",
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
