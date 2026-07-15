# Portfolio Content Corrections and Enhancements

This document outlines the discrepancies found between the current content in `src/data.ts` and the actual specifications, tech stacks, and repository URLs retrieved from the respective GitHub repositories (located in local project directories). It also proposes new projects to add and enhancements to the About, Experience, and Skills sections to make the website more impressive.

---

## 1. Project-by-Project Corrections

### ConnectMe
* **Discrepancy (URL)**: Current URL in `src/data.ts` is `https://github.com/Chiranth-Janardhan-moger/connectme`. The actual GitHub repository is capitalized with an underscore: `https://github.com/Chiranth-Janardhan-moger/Connect_Me`.
* **Discrepancy (Tech Stack & Database)**: The README lists MySQL as a database, but the actual Express backend utilizes MongoDB (Mongoose) and Redis (@upstash/redis), and the mobile app is built with React Native (Expo) and NativeWind.
* **Proposed Corrections**:
  * Update repository URL to `https://github.com/Chiranth-Janardhan-moger/Connect_Me`.
  * Update tech stack to show TypeScript, React Native, Expo, Node.js, Socket.IO, MongoDB, and Redis.

### Silent Cry Decoder
* **Discrepancy (URL)**: Current URL in `src/data.ts` is `https://github.com/Chiranth-Janardhan-moger/silent-cry-decoder`. The actual GitHub repository remote points to `https://github.com/Chiranth-Janardhan-moger/The-Silent-Cry-Decoder`.
* **Discrepancy (Description & Tech Stack)**: The current description is basic and lists only standard PyTorch. The actual repository features a hybrid 3-stream feature fusion neural network:
  1. Visual Stream: EfficientNet-B0 CNN processing Log-Mel spectrograms.
  2. Sequential Stream: Handcrafted BiLSTM sequence model with temporal attention (tracking MFCCs, ZCR, RMS energy, spectral centroid).
  3. Pretrained Stream: OpenAI Whisper-small SSL semantic feature extractor.
  It also features a FastAPI backend microservice and a responsive PWA client built with Web Audio API.
* **Proposed Corrections**:
  * Update repository URL to `https://github.com/Chiranth-Janardhan-moger/The-Silent-Cry-Decoder`.
  * Update description to detail the 3-stream feature fusion architecture (EfficientNet-B0 + BiLSTM + Whisper-small).
  * Update tech stack to `["PyTorch", "FastAPI", "Python", "OpenAI Whisper", "EfficientNet-B0", "Librosa", "PWA"]`.

### SQLGuardJS
* **Discrepancy (Tech Stack)**: The tech stack currently list `["Node.js", "Express", "npm", "TypeScript"]`. The repository also houses a Python reference package (`sqlguardjs`) utilizing TensorFlow, Keras, FastAPI, Uvicorn, and scikit-learn.
* **Proposed Corrections**:
  * Update tech stack to include Python reference dependencies.
  * Keep repository URL as `https://github.com/Chiranth-Janardhan-moger/sqlguardjs` (or match the active npm link).

### MCPPro
* **Discrepancy (URL)**: Current URL is `https://github.com/Chiranth-Janardhan-moger/mcppro`. The actual repository is uppercase: `https://github.com/Chiranth-Janardhan-moger/MCPPRO`.
* **Discrepancy (Description & Tech Stack)**: Currently described simply as a retrieval pipeline. The actual system is a production-grade AI agent and Document RAG orchestration platform featuring:
  1. Next.js 14 backend orchestrator managing multi-agent interactions via Model Context Protocol (MCP) clients.
  2. FastAPI document pipeline with OCR (Tesseract/EasyOCR) and embeddings generation (BGE-M3 or OpenAI).
  3. Supabase PostgreSQL for transaction logs and Vector DBs (Qdrant, Pinecone, PGVector).
* **Proposed Corrections**:
  * Update repository URL to `https://github.com/Chiranth-Janardhan-moger/MCPPRO`.
  * Rewrite description to highlight the Next.js orchestrator and FastAPI RAG/OCR pipelines.
  * Update tech stack to `["Next.js", "FastAPI", "MCP", "Qdrant", "Supabase", "BGE-M3", "TypeScript", "Python"]`.

### CloudPulse (Major Discrepancy)
* **Discrepancy (Description & Stack)**: Currently described as a "lightweight, real-time Docker container monitoring and system telemetry agent." This is incorrect. The actual repository is an **AWS EC2 Instance Monitor & Cost Optimizer**.
* **Specifications**:
  * Automatically scans EC2 instances across all enabled AWS regions in parallel.
  * Identifies idle instances (CPU < 5% for 7 days) and estimates monthly/yearly cost waste.
  * Incorporates an AWS Cost Explorer billing dashboard and CloudWatch CPU tracking.
  * Features a profile system for managing multiple AWS accounts.
  * Tech Stack: React 19 (Frontend), Node.js/Express (Backend), AWS SDK (EC2, CloudWatch, Cost Explorer), and Docker/Docker Compose.
* **Proposed Corrections**:
  * Rewrite description to represent the AWS monitoring and cost optimization features.
  * Update stack to `["React 19", "TypeScript", "Node.js", "Express", "AWS SDK", "Docker"]`.
  * Update logs to detail parallel multi-region scanning, idle detection, and multi-account profile switching.

### Latex Editor
* **Discrepancy (Description & Tech Stack)**: Current logs mention MathJax rendering. The Android app actually compiles documents 100% offline using a native port of the **Tectonic** typesetting engine running via ProcessBuilder/JNI. The UI is built with Kotlin and Jetpack Compose.
* **Proposed Corrections**:
  * Update description to mention the native port of the Tectonic typesetting engine for offline local PDF generation.
  * Update tech stack to `["Kotlin", "Jetpack Compose", "Tectonic Engine", "JNI", "Android Studio"]`.

### VaultX Password Manager (Major Discrepancy)
* **Discrepancy (Tech Stack)**: Currently lists Kotlin, Android Studio, SQLCipher, and Room DB. The actual project is built with **React Native and Expo**.
* **Specifications**:
  * Zero cloud sync, 100% offline password manager built with React Native and Expo.
  * Security: AES-256 encryption, PBKDF2 key derivation, 6-digit PIN, biometric authentication, recovery question, auto-lockout, and screenshot prevention.
  * Built-in 2FA/TOTP Authenticator and clipboard security monitoring.
  * Native Android Autofill Integration to securely inject credentials into other apps and web browsers.
  * Templates for credentials, payment cards, and identity logs.
* **Proposed Corrections**:
  * Rewrite description to represent the React Native + Expo structure.
  * Update stack to `["React Native", "Expo", "Expo Router", "AES-256", "PBKDF2", "Autofill API"]`.
  * Update logs to mention native Android Autofill integration, built-in 2FA/TOTP, and clipboard safety features.

### Surplus2Serve
* **Discrepancy (Tech Stack)**: Lists MongoDB as the database. The actual backend uses MySQL (pooled connections via mysql2/promise) on XAMPP. It also integrates Twilio for SMS notifications and OpenCage for reverse geocoding.
* **Proposed Corrections**:
  * Update tech stack to `["React", "Node.js", "Express", "MySQL", "OpenCage API", "Twilio API"]`.

---

## 2. New Projects to Add -- no need to add

Adding these public projects from your GitHub profile will make the portfolio much more comprehensive.

### AppSec Sandbox
* **ID**: `appsec-sandbox`
* **Name**: `AppSec Sandbox`
* **Meta**: `cybersecurity · interactive playground`
* **Description**: `An interactive Capture The Flag (CTF) practice platform designed to teach key web application vulnerabilities. Includes sandboxes simulating 7 critical OWASP issues (SQLi, CSRF, IDOR, SSRF, Command Injection, JWT/Cookie Session tampering) with progress persistence and validation scripts.`
* **Stack**: `["React", "Node.js", "Express", "SQLite", "TypeScript", "Shell Scripting"]`
* **GitHub URL**: `https://github.com/Chiranth-Janardhan-moger/ctf-academy`
* **Logs**:
  * "Interactive sandboxes simulating 7 critical OWASP web vulnerabilities with progress persistence in localStorage"
  * "Secure backend design binding strictly to localhost and safe platform-independent command execution simulation"

### Vedics Meditation
* **ID**: `vedics-meditation`
* **Name**: `Vedics Meditation`
* **Meta**: `frontend UI · animations`
* **Description**: `A premium wellness and meditation frontend UI showcasing clean design, glassmorphism components, and smooth interactive navigation.`
* **Stack**: `["React", "TypeScript", "Tailwind CSS", "Vite"]`
* **GitHub URL**: `https://github.com/Chiranth-Janardhan-moger/vedics`
* **Logs**:
  * "Stunning premium visual design with custom animated timers and audio player layouts"

---

## 3. Experience Section Enhancements

We should refine the descriptions of the freelance clients in `src/data.ts` to highlight scale, specific features, and architectural improvements.

### Client 1 (EduManage)
* **Current role**: Freelance Full-Stack Developer
* **Current company**: Client 1 — I-School (Ed-Tech Management Suite)
* **Proposed Text**:
  * **Role/Company**: `Freelance Full-Stack Developer / Client 1 — EduManage (Tuition Management)`
  * **Description**: `Built EduManage, a production-ready React Native + Node.js fee and attendance administration application. Features a multi-role dashboard (Admin, Parent, Developer), smart joining-date-based fee cycles, leave application approvals, Socket.io real-time chat, feature toggles, and direct APK auto-updates with download resumption. Reduced load times by 60% and memory by 40% (handles 500+ active students).`

### Client 2 (dSK Mart)
* **Current role**: Freelance Full-Stack Developer
* **Current company**: Client 2 — DSK Mart (Enterprise Retail & Feedback System)
* **Proposed Text**:
  * **Role/Company**: `Freelance Full-Stack Developer / Client 2 — dSK Mart (E-Commerce & Delivery Ecosystem)`
  * **Description**: `Architected dSK Mart, a multi-platform e-commerce ecosystem consisting of a customer shopping portal and admin panel (React + Vite + TypeScript + Tailwind CSS), a delivery boy mobile app (React Native + Expo with QR scanning and location telemetry), and a backend REST + GraphQL API (Express + Apollo Server + MongoDB Atlas).`

---

## 4. Overall Website & About Section Enhancements

To make the website more impressive, we propose:
3. **Refined "About" Intro**: Update the hero description to showcase your dedication to rigorous engineering:
   > Final-year B.E. Information Science & Engineering student at BMSIT, Bengaluru, specializing in applied machine learning, Android systems, and application security. I prioritize architectural transparency and rigorous testing, preferring to document a vulnerability or performance ceiling in my own work rather than leave it unaddressed.

---

## Proposed Code Changes for `src/data.ts`

When verified, the following structure will replace the existing arrays in `src/data.ts`.

```typescript
export const EXPERIENCES: Experience[] = [
  // Hackathons...
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
  // Freelance Clients...
  {
    id: "freelance-client-1",
    role: "Freelance Full-Stack Developer",
    company: "Client 1 — EduManage (Tuition Management Suite)",
    dates: "2024 – 2025",
    desc: "Designed and engineered school management portals and student attendance/schedules trackers. Built EduManage, an all-in-one learning administration panel for courses, combined with a custom tuition management app to monitor schedules, attendance, homework cycles, and student performance metrics.",
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
    desc: "Architected dSK Mart, a multi-platform e-commerce ecosystem consisting of a customer shopping portal and admin panel (React + Vite + TypeScript + Tailwind CSS), a delivery boy mobile app (React Native + Expo with QR scanning and location telemetry), and a backend REST + GraphQL API (Express + Apollo Server + MongoDB Atlas).",
    links: [
      { label: "Admin Console Repo", url: "https://github.com/Chiranth-Janardhan-moger/Client-2_DSK_MART" },
      { label: "Feedback Service Repo", url: "https://github.com/Chiranth-Janardhan-moger/feedback_dsk_mart" }
    ]
  },
  // Leadership...
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
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/Ml-dataset",
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
    id: "appsec-sandbox",
    name: "AppSec Sandbox",
    meta: "cybersecurity · interactive CTF",
    desc: "An interactive Capture The Flag (CTF) practice platform simulating real-world application security vulnerabilities (SQLi, session tampering, IDOR, SSRF, command injection).",
    stack: ["React", "Node.js", "Express", "SQLite", "TypeScript", "Shell scripting"],
    githubUrl: "https://github.com/Chiranth-Janardhan-moger/ctf-academy",
    demoUrl: "#",
    logs: [
      { type: "VERIFIED", text: "Interactive sandboxes simulating 7 critical OWASP web vulnerabilities with progress persistence in localStorage" },
      { type: "VERIFIED", text: "Secure backend design binding strictly to localhost and safe platform-independent command execution simulation" }
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
  },
];
```
