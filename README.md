# Chiranth Moger Portfolio

A high-performance, responsive, and minimalist developer portfolio showcasing systems engineering, applied machine learning, Android development, and cybersecurity credentials. The site incorporates a live Express API gateway and interactive sandboxes built with React 19, Vite, and Tailwind CSS.

---

## Technical Architecture

The codebase utilizes a hybrid design split between a client-side Single Page Application (SPA) and a server-side API handler:

* **Client Engine**: Built using React 19, TypeScript, and Vite. Leverages Tailwind CSS for clean typographic styling and Motion for fluid interface state transitions.
* **Backend Gateway**: Powered by Node.js and Express. It manages traffic rate limiting, counts visitor telemetry, redirects malicious probes via honeypot routes, and hosts the interactive SQLGuardJS scanning playground.
* **Security Shield**: Integrated with SQLGuardJS request-scanning middleware to defend the gateway and log security traffic in real-time.

---

## Core Project Catalog

The portfolio hosts an audited catalog of technical projects:

* **ConnectMe**: A React Native (Expo) and Node.js campus shuttle tracking system incorporating Socket.IO coord streams, MongoDB caches, and Firebase push alerts.
* **Silent Cry Decoder**: An acoustic infant cry classifier built on PyTorch and FastAPI utilizing a 3-stream feature fusion architecture (EfficientNet-B0 CNN, BiLSTM sequence attention, and OpenAI Whisper SSL).
* **SQLGuardJS**: A request-scanning security middleware for Express applications published to the npm registry.
* **MCPPro**: An AI orchestrator and Document RAG platform using Next.js, FastAPI, Qdrant, Supabase, and custom Model Context Protocol clients.
* **VisionTraffic**: A real-time computer vision traffic density tracker employing YOLOv8, ByteTrack, and OpenCV.
* **CloudPulse**: A multi-account AWS EC2 monitor and cost optimizer running cost waste estimation algorithms via AWS SDK and CloudWatch.
* **Latex Editor**: An Android LaTeX authoring tool compiling document PDFs offline using a native port of the Tectonic typesetting engine (JNI/ProcessBuilder).
* **VaultX**: A zero-network password manager built with React Native and Expo implementing AES-256 local cryptography and Android Autofill service hooks.
* **Surplus2Serve**: A real-time donation routing application utilizing a MySQL DB pool, OpenCage geocoding, and Twilio alert triggers.

---

## Getting Started

### Prerequisites

* Node.js (version 18.x or higher)
* npm (package manager)

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Chiranth-Janardhan-moger/Latest-portfolio.git
   cd Latest-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (runs Vite dev server and Express listener simultaneously):
   ```bash
   npm run dev
   ```

4. Open the local port in your browser:
   ```
   http://localhost:3000
   ```

### Production Build

To compile the static frontend assets and bundle the Express server for production:

```bash
npm run build
```

This outputs static client files into `dist/` and compiles `server.ts` into a single Node CJS bundle located at `dist/server.cjs`. Run the server using:

```bash
npm start
```

---

## Deployment

The frontend of this portfolio is configured for deployment on Vercel:

```bash
vercel deploy --prod
```

It builds as a static application and routes client routing dynamically to support clean URL parameters.
