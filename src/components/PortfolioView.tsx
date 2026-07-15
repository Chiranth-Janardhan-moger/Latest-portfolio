import React, { useState } from 'react';
import { 
  Mail, 
  Github, 
  ExternalLink,
  Shield,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Play,
  RefreshCw,
  Package,
  Container,
  Trophy
} from 'lucide-react';
import { EDUCATION, EXPERIENCES, PROJECTS } from '../data';
import { Project } from '../types';

interface PortfolioViewProps {
  onNavigateToContact: () => void;
}

export default function PortfolioView({ onNavigateToContact }: PortfolioViewProps) {
  // SQLGuardJS Playground states
  const [testPayload, setTestPayload] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: number;
    ok: boolean;
    data: any;
  } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [recentThreats, setRecentThreats] = useState<any[]>([]);
  const [showRecentThreats, setShowRecentThreats] = useState<boolean>(false);
  const [isPlaygroundExpanded, setIsPlaygroundExpanded] = useState<boolean>(false);

  const handleScanPayload = async () => {
    if (!testPayload.trim()) return;
    setIsScanning(true);
    setScanResult(null);
    let status = 500;
    let ok = false;
    try {
      const response = await fetch('/api/security/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payload: testPayload })
      });
      
      status = response.status;
      ok = response.ok;
      
      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonErr: any) {
          data = { error: 'Invalid JSON Response', message: jsonErr.message };
        }
      } else {
        const textText = await response.text();
        const isSqli = testPayload.toLowerCase().includes("select") || testPayload.includes("'") || testPayload.includes("--");
        const isXss = testPayload.toLowerCase().includes("<") || testPayload.toLowerCase().includes("script") || testPayload.toLowerCase().includes("onerror");
        data = { 
          error: 'Forbidden', 
          message: 'Malicious payload detected by SQLGuardJS',
          details: { label: isSqli ? 'sqli' : isXss ? 'xss' : 'malicious' },
          rawResponse: textText.substring(0, 150)
        };
      }
      
      setScanResult({
        status,
        ok,
        data
      });
      if (showRecentThreats) {
        setTimeout(fetchLogs, 500);
      }
    } catch (err: any) {
      console.error(err);
      setScanResult({
        status: status,
        ok: ok,
        data: { 
          error: status === 403 ? 'Forbidden' : 'Internal Connection Failure', 
          message: err.message 
        }
      });
    } finally {
      setIsScanning(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/security/logs');
      if (response.ok) {
        const data = await response.json();
        const logsArray = Array.isArray(data) ? data : [];
        setRecentThreats([...logsArray].reverse());
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const toggleRecentThreats = () => {
    if (showRecentThreats) {
      setShowRecentThreats(false);
    } else {
      setShowRecentThreats(true);
      fetchLogs();
    }
  };

  const handleDemoClick = (e: React.MouseEvent, proj: Project) => {
    if (proj.demoUrl === "#") {
      e.preventDefault();
      
      let msg = `Live demo for ${proj.name} is running on local hardware or currently offline.`;
      if (proj.id === "connectme") {
        msg = "ConnectMe's real-time tracker is hosted on-device and private campus network clusters.";
      } else if (proj.id === "silent-cry") {
        msg = "Silent Cry Decoder's PyTorch classification pipeline runs on local diagnostic hardware.";
      } else if (proj.id === "mcppro") {
        msg = "MCPPro's RAG indexing and embedding pipelines run as local background daemon services.";
      } else if (proj.id === "sentinel") {
        msg = "Sentinel is a native Android application blocker; sideload the APK from the GitHub repository.";
      } else if (proj.id === "visiontraffic") {
        msg = "VisionTraffic is deployed directly on municipal edge CCTV processor units.";
      } else if (proj.id === "surplus2serve") {
        msg = "Surplus2Serve is running on on-premises community kitchen hardware and currently offline from public cloud.";
      }
      alert(msg);
    }
  };

  return (
    <div className="space-y-16 py-8 animate-fade-in" id="portfolio-container">
      {/* Hero Section */}
      <section className="pt-8 pb-4" id="hero">
        <div className="font-mono text-xs text-ink-soft mb-5 flex items-center gap-2" id="prompt-line">
          <span>&gt; whoami</span>
          <span className="w-2.5 h-4 bg-ink inline-block terminal-cursor" id="cursor-blink"></span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-none mb-4" id="name-header">
          Chiranth Moger
        </h1>
        <p className="font-mono text-sm sm:text-base text-ink-soft mb-6" id="title-roles">
          Applied ML <span className="text-line mx-1">/</span> Android <span className="text-line mx-1">/</span> Full Stack <span className="text-line mx-1">/</span> Cybersecurity
        </p>
        <div className="text-base sm:text-lg text-ink-soft max-w-[65ch] leading-relaxed mb-8" id="intro-text">
          <p>
            Final-year B.E. Information Science & Engineering student at BMSIT, Bengaluru, specializing in applied machine learning, Android systems, and application security. I prioritize architectural transparency and rigorous testing, preferring to document a vulnerability or performance ceiling in my own work rather than leave it unaddressed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 font-mono text-xs" id="hero-actions">
          <button
            onClick={onNavigateToContact}
            className="flex items-center gap-2 border border-line rounded-sm px-4 py-2 hover:border-ink hover:bg-cream hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ease-out cursor-pointer btn-sweep"
            id="btn-contact-me"
          >
            <Mail size={13} className="shrink-0" />
            <span>Connect</span>
          </button>
          <a
            href="https://github.com/Chiranth-Janardhan-moger"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-line rounded-sm px-4 py-2 hover:border-ink hover:bg-cream hover:-translate-y-0.5 transition-all duration-200 ease-out btn-sweep"
            id="link-github"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/chiranth-moger-01a867316/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-line rounded-sm px-4 py-2 hover:border-ink hover:bg-cream hover:-translate-y-0.5 transition-all duration-200 ease-out btn-sweep"
            id="link-linkedin"
          >
            LinkedIn
          </a>
          <a
            href="/assets/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-line rounded-sm px-4 py-2 hover:border-ink hover:bg-cream hover:-translate-y-0.5 transition-all duration-200 ease-out btn-sweep"
            id="link-resume"
          >
            Resume
          </a>
        </div>
      </section>

      {/* Education */}
      <section className="border-t border-line pt-12" id="education">
        <div className="font-mono text-xs tracking-wider uppercase text-ink-soft mb-6 flex items-center gap-3" id="edu-label">
          <span>education</span>
          <div className="h-[1px] bg-line flex-1"></div>
        </div>
        <div className="space-y-6" id="education-list">
          {EDUCATION.map((edu, idx) => (
            <div key={idx} id={`edu-item-${idx}`} className="ps-1">
              <h3 className="font-bold text-lg text-ink" id={`edu-inst-${idx}`}>
                {edu.institution === "BMS Institute of Technology and Management" ? (
                  <a 
                    href="https://bmsit.ac.in/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline transition-all"
                  >
                    {edu.institution} {edu.location && <span className="font-normal text-sm text-ink-soft ml-1">{edu.location}</span>}
                  </a>
                ) : (
                  <span>
                    {edu.institution} {edu.location && <span className="font-normal text-sm text-ink-soft ml-1">{edu.location}</span>}
                  </span>
                )}
              </h3>
              <p className="font-mono text-xs text-ink-soft mt-1.5" id={`edu-meta-${idx}`}>
                {edu.degree}
                {edu.gpa && ` — ${edu.gpa}`}
                {edu.period && ` ${edu.period}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-line pt-12" id="experience">
        <div className="font-mono text-xs tracking-wider uppercase text-ink-soft mb-6 flex items-center gap-3" id="exp-label">
          <span>experience</span>
          <div className="h-[1px] bg-line flex-1"></div>
        </div>
        <div className="space-y-4" id="experience-list">
          {EXPERIENCES.filter(exp => exp.id.startsWith("freelance-")).map((exp) => (
            <div
              key={exp.id}
              className="border border-line rounded-xl p-5 bg-paper hover:-translate-y-1 hover:border-ink hover:shadow-md transition-all duration-300 ease-out"
              id={`exp-card-${exp.id}`}
            >
              <div className="flex justify-between items-baseline gap-3 flex-wrap" id={`exp-header-${exp.id}`}>
                <h3 className="font-bold text-base text-ink" id={`exp-role-${exp.id}`}>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors cursor-pointer"
                    >
                      {exp.role}
                    </a>
                  ) : (
                    exp.role
                  )}
                </h3>
                <span className="font-mono text-xs text-ink-soft" id={`exp-dates-${exp.id}`}>{exp.dates}</span>
              </div>
              {exp.company && (
                <p className="font-mono text-xs text-ink-soft mt-1" id={`exp-company-${exp.id}`}>{exp.company}</p>
              )}
              <p className="text-sm text-ink-soft mt-3 leading-relaxed" id={`exp-desc-${exp.id}`}>{exp.desc}</p>
              
              {exp.links && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono" id={`exp-links-${exp.id}`}>
                  {exp.links.map((link, idx) => {
                    const isRepo = link.label.toLowerCase().includes('repo') || link.url.includes('github.com');
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-soft hover:text-ink hover:underline inline-flex items-center gap-1.5 border border-line rounded px-2.5 py-1 bg-cream/30 hover:bg-cream transition-colors"
                        id={`exp-link-${exp.id}-${idx}`}
                      >
                        {isRepo ? <Github size={10} /> : <ExternalLink size={10} />}
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Hackathons & Achievements */}
      <section className="border-t border-line pt-12" id="hackathons">
        <div className="font-mono text-xs tracking-wider uppercase text-ink-soft mb-6 flex items-center gap-3" id="hackathons-label">
          <span>hackathons & achievements</span>
          <div className="h-[1px] bg-line flex-1"></div>
        </div>
        <div className="space-y-4" id="hackathons-list">
          {EXPERIENCES.filter(exp => exp.id.startsWith("hackathon-")).map((exp) => (
            <div
              key={exp.id}
              className="border border-line rounded-xl p-5 bg-paper hover:-translate-y-1 hover:border-ink hover:shadow-md transition-all duration-300 ease-out"
              id={`exp-card-${exp.id}`}
            >
              <div className="flex justify-between items-baseline gap-3 flex-wrap" id={`exp-header-${exp.id}`}>
                <h3 className="font-bold text-base text-ink flex items-center gap-2" id={`exp-role-${exp.id}`}>
                  <Trophy size={14} className="text-amber-500 fill-amber-500/10" />
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors cursor-pointer"
                    >
                      {exp.role}
                    </a>
                  ) : (
                    exp.role
                  )}
                </h3>
                <span className="font-mono text-xs text-ink-soft" id={`exp-dates-${exp.id}`}>{exp.dates}</span>
              </div>
              {exp.company && (
                <p className="font-mono text-xs text-ink-soft mt-1" id={`exp-company-${exp.id}`}>{exp.company}</p>
              )}
              <p className="text-sm text-ink-soft mt-3 leading-relaxed" id={`exp-desc-${exp.id}`}>{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Activities */}
      <section className="border-t border-line pt-12" id="leadership">
        <div className="font-mono text-xs tracking-wider uppercase text-ink-soft mb-6 flex items-center gap-3" id="leadership-label">
          <span>leadership & activities</span>
          <div className="h-[1px] bg-line flex-1"></div>
        </div>
        <div className="space-y-4" id="leadership-list">
          {EXPERIENCES.filter(exp => !exp.id.startsWith("freelance-") && !exp.id.startsWith("hackathon-")).map((exp) => (
            <div
              key={exp.id}
              className="border border-line rounded-xl p-5 bg-paper hover:-translate-y-1 hover:border-ink hover:shadow-md transition-all duration-300 ease-out"
              id={`exp-card-${exp.id}`}
            >
              <div className="flex justify-between items-baseline gap-3 flex-wrap" id={`exp-header-${exp.id}`}>
                <h3 className="font-bold text-base text-ink" id={`exp-role-${exp.id}`}>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors cursor-pointer"
                    >
                      {exp.role}
                    </a>
                  ) : (
                    exp.role
                  )}
                </h3>
                <span className="font-mono text-xs text-ink-soft" id={`exp-dates-${exp.id}`}>{exp.dates}</span>
              </div>
              {exp.company && (
                <p className="font-mono text-xs text-ink-soft mt-1" id={`exp-company-${exp.id}`}>{exp.company}</p>
              )}
              <p className="text-sm text-ink-soft mt-3 leading-relaxed" id={`exp-desc-${exp.id}`}>{exp.desc}</p>
              
              {exp.links && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono" id={`exp-links-${exp.id}`}>
                  {exp.links.map((link, idx) => {
                    const isRepo = link.label.toLowerCase().includes('repo') || link.url.includes('github.com');
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-soft hover:text-ink hover:underline inline-flex items-center gap-1.5 border border-line rounded px-2.5 py-1 bg-cream/30 hover:bg-cream transition-colors"
                        id={`exp-link-${exp.id}-${idx}`}
                      >
                        {isRepo ? <Github size={10} /> : <ExternalLink size={10} />}
                        <span>{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="border-t border-line pt-12" id="projects">
        <div className="font-mono text-xs tracking-wider uppercase text-ink-soft mb-6 flex items-center gap-3" id="projects-label">
          <span>project log</span>
          <div className="h-[1px] bg-line flex-1"></div>
        </div>
        <div className="space-y-6" id="projects-list">
          {PROJECTS.map((proj) => (
            <div
               key={proj.id}
               className={`relative overflow-hidden border border-line hover:border-ink rounded-xl p-6 bg-paper hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out ${proj.id === 'sqlguardjs' && !isPlaygroundExpanded ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2' : ''}`}
              id={`project-card-${proj.id}`}
              onClick={proj.id === 'sqlguardjs' && !isPlaygroundExpanded ? () => setIsPlaygroundExpanded(true) : undefined}
              tabIndex={proj.id === 'sqlguardjs' && !isPlaygroundExpanded ? 0 : undefined}
              role={proj.id === 'sqlguardjs' && !isPlaygroundExpanded ? 'button' : undefined}
              aria-expanded={proj.id === 'sqlguardjs' ? isPlaygroundExpanded : undefined}
              aria-label={proj.id === 'sqlguardjs' && !isPlaygroundExpanded ? 'SQLGuardJS Project. Click or press Enter to launch the live defense sandbox playground.' : undefined}
              onKeyDown={
                proj.id === 'sqlguardjs' && !isPlaygroundExpanded
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsPlaygroundExpanded(true);
                      }
                    }
                  : undefined
              }
            >
              {proj.id === 'sqlguardjs' && (
                <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-[12px] left-[-22px] w-[70px] h-[7px] bg-ink transform -rotate-45" />
                </div>
              )}
              <div className="flex justify-between items-start gap-4 flex-wrap mb-2" id={`project-head-${proj.id}`}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap" id={`project-title-wrapper-${proj.id}`}>
                    <h3 className="text-xl font-bold text-ink" id={`project-name-${proj.id}`}>{proj.name}</h3>
                  </div>
                  <span className="font-mono text-xs text-ink-soft" id={`project-meta-${proj.id}`}>{proj.meta}</span>
                </div>
                <div className="flex gap-2" id={`project-links-${proj.id}`} onClick={(e) => e.stopPropagation()}>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300 ease-out"
                      title="GitHub Repository"
                      id={`project-gh-${proj.id}`}
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {proj.demoUrl && proj.demoUrl !== "#" && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      onClick={(e) => handleDemoClick(e, proj)}
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300 ease-out"
                      title={proj.id === 'sqlguardjs' ? "npm Registry Package" : (proj.id === 'cloudpulse' ? "Docker Container Metrics" : "Live Project")}
                      id={`project-demo-${proj.id}`}
                    >
                      {proj.id === 'sqlguardjs' ? <Package size={14} /> : (proj.id === 'cloudpulse' ? <Container size={14} /> : <ExternalLink size={14} />)}
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-ink-soft leading-relaxed mt-2 mb-4" id={`project-desc-${proj.id}`}>
                {proj.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5" id={`project-stack-${proj.id}`}>
                {proj.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] text-ink-soft border border-line rounded-full px-2.5 py-0.5 bg-cream"
                    id={`project-tech-${proj.id}-${tech.replace(/\s+/g, '-')}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-2.5 border-t border-line/60 pt-4" id={`project-logs-${proj.id}`}>
                {proj.logs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start font-mono text-xs" id={`project-log-row-${proj.id}-${index}`}>
                    <span className="text-ink-soft select-none mt-0.5 shrink-0" id={`log-bullet-${proj.id}-${index}`}>·</span>
                    <span className="text-ink-soft leading-tight" id={`log-text-${proj.id}-${index}`}>{log.text}</span>
                  </div>
                ))}
              </div>

              {proj.id === "sqlguardjs" && !isPlaygroundExpanded && (
                <div 
                  className="mt-6 flex flex-col items-center justify-center p-8 border border-dashed border-line rounded-xl bg-cream/10 hover:bg-cream/20 hover:border-ink transition-all duration-300 group" 
                  id="sqlguardjs-collapsed-trigger"
                >
                  <div className="w-12 h-12 rounded-full border border-line flex items-center justify-center bg-paper group-hover:scale-105 transition-all duration-300 mb-3 shadow-2xs">
                    <Shield size={20} className="text-ink-soft group-hover:text-ink transition-colors" />
                  </div>
                  <h4 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mb-1">
                    TEST SQLGUARDJS LIVE HEURISTICS
                  </h4>
                  <p className="text-[11px] text-ink-soft text-center max-w-[40ch]">
                    Click anywhere on this card to launch the interactive live defense sandbox playground.
                  </p>
                </div>
              )}

              {proj.id === "sqlguardjs" && isPlaygroundExpanded && (
                <div className="mt-6 border border-line bg-cream/20 rounded-xl p-4 sm:p-5 relative animate-fade-in" id="sqlguardjs-playground" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-start gap-4 mb-3" id="sqlguardjs-playground-header">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-ink animate-pulse" />
                      <h4 className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
                        SQLGuardJS Live Protection Shield Playground
                      </h4>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaygroundExpanded(false);
                      }}
                      className="font-mono text-[10px] text-ink-soft hover:text-ink hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                      title="Collapse Playground"
                      id="btn-collapse-playground"
                    >
                      <span>[ Collapse ]</span>
                    </button>
                  </div>
                  <p className="text-xs text-ink-soft mb-4 leading-relaxed">
                    Test Chiranth's published middleware live. Input any payload or select a signature below to see SQLGuardJS evaluate, score, and defend the gateway in real-time.
                  </p>

                  {/* Preset quick test buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      onClick={() => setTestPayload("SELECT * FROM users WHERE email = 'recruiter@bmsit.edu'")}
                      className="font-mono text-[10px] border border-line hover:border-ink hover:bg-paper px-2.5 py-1 rounded-sm text-ink-soft hover:text-ink transition-all cursor-pointer"
                    >
                      Safe Query
                    </button>
                    <button
                      onClick={() => setTestPayload("' UNION SELECT username, password_hash FROM admin_users --")}
                      className="font-mono text-[10px] border border-line hover:border-red-500/50 hover:bg-red-50/50 px-2.5 py-1 rounded-sm text-ink-soft hover:text-red-600 transition-all cursor-pointer"
                    >
                      SQL Injection Attack
                    </button>
                    <button
                      onClick={() => setTestPayload('<img src=x onerror="alert(document.domain)">')}
                      className="font-mono text-[10px] border border-line hover:border-amber-500/50 hover:bg-amber-50/50 px-2.5 py-1 rounded-sm text-ink-soft hover:text-amber-600 transition-all cursor-pointer"
                    >
                      XSS script injection
                    </button>
                    <button
                      onClick={() => setTestPayload('{"$ne": null}')}
                      className="font-mono text-[10px] border border-line hover:border-orange-500/50 hover:bg-orange-50/50 px-2.5 py-1 rounded-sm text-ink-soft hover:text-orange-600 transition-all cursor-pointer"
                    >
                      NoSQL injection bypass
                    </button>
                  </div>

                  {/* Textarea Input */}
                  <div className="relative mb-3">
                    <textarea
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      placeholder="Type a query, script, or payload to scan..."
                      className="w-full h-20 font-mono text-xs p-3 bg-paper border border-line focus:border-ink focus:outline-none rounded-md resize-none"
                    />
                    <button
                      disabled={isScanning || !testPayload.trim()}
                      onClick={handleScanPayload}
                      className="absolute right-2 bottom-3 font-mono text-[10px] bg-ink hover:bg-ink-soft text-paper disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {isScanning ? (
                        <RefreshCw size={10} className="animate-spin" />
                      ) : (
                        <Play size={10} />
                      )}
                      <span>Scan Payload</span>
                    </button>
                  </div>

                  {/* Scan Result Terminal */}
                  {scanResult && (
                    <div className="border border-line rounded-md overflow-hidden bg-paper font-mono text-xs mb-3 animate-fade-in">
                      <div className="border-b border-line bg-cream px-3 py-1.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                        <div className="flex items-center gap-1.5 self-start">
                           <Terminal size={12} className="text-ink-soft" />
                           <span className="text-[10px] font-semibold text-ink-soft uppercase tracking-wider">
                             Shield Gateway Inspection Report
                           </span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm self-start sm:self-auto ${
                          scanResult.status === 200 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          HTTP {scanResult.status} {scanResult.status === 200 ? 'OK' : 'FORBIDDEN'}
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        {scanResult.status === 200 ? (
                          <div className="flex items-start gap-2 text-green-700">
                            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="font-bold">Request Passed Safely</p>
                              <p className="text-ink-soft text-[11px] mt-0.5">
                                SQLGuardJS checked the body payload and verified that it does not exceed heuristic threat indicators.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 text-red-700">
                            <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="font-bold">Threat Intercepted & Blocked</p>
                              <p className="text-ink-soft text-[11px] mt-0.5">
                                Real-time dynamic shield matched signature rules. Attack type classified as: <span className="font-bold underline text-red-700">{scanResult.data?.details?.label || 'malicious'}</span>.
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="border-t border-line/60 pt-2 mt-2">
                          <span className="text-[10px] text-ink-soft uppercase tracking-wider">Gateway Response Payload:</span>
                          <pre className="mt-1 bg-cream/40 p-2 rounded-sm text-[10px] text-ink overflow-x-auto max-h-24 leading-relaxed">
                            {JSON.stringify(scanResult.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Threat logs button */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-t border-line/40 pt-3 mt-3">
                    <button
                      onClick={toggleRecentThreats}
                      className="font-mono text-[10px] text-ink-soft hover:text-ink underline cursor-pointer flex items-center gap-1 self-start"
                    >
                      <span>{showRecentThreats ? "Hide Logs" : "View Live Logs"}</span>
                    </button>
                    <span className="font-mono text-[9px] text-ink-soft self-start sm:self-auto">
                      Heuristics Sensitivity: Balanced
                    </span>
                  </div>

                  {/* Threat logs panel */}
                  {showRecentThreats && (
                    <div className="mt-3 border border-line bg-paper rounded-md p-3 max-h-48 overflow-y-auto space-y-2 animate-fade-in">
                      <div className="flex justify-between items-center mb-2 border-b border-line/40 pb-1">
                        <span className="font-mono text-[10px] text-ink font-bold uppercase tracking-wider">
                          Intercepted In-Memory Logs
                        </span>
                        <button onClick={fetchLogs} className="text-[9px] text-ink-soft hover:text-ink underline cursor-pointer">
                          Refresh
                        </button>
                      </div>
                      {recentThreats.length === 0 ? (
                        <p className="text-center py-4 text-ink-soft font-mono text-[10px]">
                          No logged security events. Try performing a demo attack above to trigger a live log!
                        </p>
                      ) : (
                        recentThreats.map((log, idx) => (
                           <div key={idx} className="border-b border-line/40 last:border-0 pb-1.5 last:pb-0 text-[10px] font-mono flex justify-between items-start gap-2">
                             <div className="space-y-0.5">
                               <div className="flex items-center gap-1.5">
                                 <span className={`px-1 py-0.2 rounded-sm text-[9px] font-bold ${
                                   log.action === 'block' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                 }`}>
                                   {log.action?.toUpperCase() || 'DETECTION'}
                                 </span>
                                 <span className="text-ink-soft text-[9px]">
                                   Label: <span className="text-red-600 font-bold">{log.label}</span>
                                 </span>
                               </div>
                               <div className="text-ink text-[10px] mt-1 break-all">
                                 <span className="text-ink-soft">Payload:</span> "{log.payloadPreview}"
                               </div>
                             </div>
                             <span className="text-ink-soft text-[9px] shrink-0 text-right">
                               {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'now'}
                             </span>
                           </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Beautiful High-Impact Call to Action */}
      <section className="border-t border-line pt-16 pb-8 text-center" id="cta-connect">
        <div className="max-w-xl mx-auto" id="cta-inner">
          <p className="font-mono text-xs text-ink-soft uppercase tracking-widest mb-4" id="cta-subtitle">
            Need to build something?
          </p>
          
          <div
            onClick={onNavigateToContact}
            className="group cursor-pointer inline-block hover:scale-102 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4 rounded-lg"
            id="cta-main-trigger"
            tabIndex={0}
            role="button"
            aria-label="Ready to Connect? Navigate to the contact form"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigateToContact();
              }
            }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink mb-6 hover:text-ink-soft transition-all duration-300 ease-out leading-tight" id="cta-title">
              Ready to Connect?
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
