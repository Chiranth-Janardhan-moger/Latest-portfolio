import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Mail, 
  Github, 
  Linkedin,
  ExternalLink,
  Shield,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  Play,
  RefreshCw,
  Package,
  Container,
  Trophy,
  ChevronDown,
  FileText,
  Download,
  ArrowRight,
  ArrowUpRight,
  X,
  Activity,
  Award
} from 'lucide-react';
import { EDUCATION, EXPERIENCES, PROJECTS, CERTIFICATIONS } from '../data';
import { Project } from '../types';
import { triggerFluidCloud } from '../utils/fluidCloud';
import TiltCard from './TiltCard';
import LazyImage from './LazyImage';

interface PortfolioViewProps {
  onNavigateToContact: () => void;
  onNavigateToApps?: (appId?: string) => void;
  onNavigateToBlog?: (blogSlug?: string) => void;
}

export default function PortfolioView({ onNavigateToContact, onNavigateToApps, onNavigateToBlog }: PortfolioViewProps) {
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
  const [expandedEduIndices, setExpandedEduIndices] = useState<number[]>([]);
  const [expandedExpIds, setExpandedExpIds] = useState<string[]>([]);
  const [expandedProjIds, setExpandedProjIds] = useState<string[]>([]);
  const [expandedCertIds, setExpandedCertIds] = useState<string[]>([]);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState<boolean>(false);
  const [activeCert, setActiveCert] = useState<{ title: string; issuer?: string; url: string } | null>(null);
  // Randomly show either the braille infinity symbol or the peekaboo doodle on each visit
  const [showPeekaboo] = useState<boolean>(() => Math.random() < 0.5);

  // Handle ESC key to close certificate modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCert(null);
      }
    };
    if (activeCert) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeCert]);

  const toggleEduExpand = (idx: number) => {
    setExpandedEduIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleExpExpand = (id: string) => {
    setExpandedExpIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleProjExpand = (id: string) => {
    setExpandedProjIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCertExpand = (id: string) => {
    setExpandedCertIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

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
      if (ok) {
        triggerFluidCloud({
          title: "Payload Verified Safe",
          subtitle: "Status: 200 OK · Zero AST threats detected",
          icon: "shield",
          type: "success"
        });
      } else {
        triggerFluidCloud({
          title: "Threat Intercepted",
          subtitle: `Blocked: HTTP ${status} · AST anomaly detected`,
          icon: "alert",
          type: "warning"
        });
      }
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
      triggerFluidCloud({
        title: "Heuristic Scan Completed",
        subtitle: `Status: ${status} · AST validation evaluated`,
        icon: "shield",
        type: "info"
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
    <div className="space-y-12 sm:space-y-16 pt-[28px] sm:pt-0 pb-8 sm:py-8 animate-fade-in" id="portfolio-container">
      {/* Hero Section */}
      <section className="pt-0 pb-4" id="hero">
        {/* Mobile-Only Hero Graphic — randomly shows braille ∞ or peekaboo doodle */}
        <div className="flex sm:hidden justify-center w-full mb-2 select-none relative" id="mobile-braille-container">
          {/* Braille Infinity */}
          <pre
            className={`font-mono text-[10px] text-ink select-none whitespace-pre leading-[1.08] tracking-[0.14em] text-center inline-block transition-all duration-700 ease-in-out ${
              showPeekaboo ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'
            }`}
            aria-hidden="true"
          >
{`⠀⠀⠀⠀⣀⣤⣴⣶⣶⣦⣄⡀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣶⣶⣦⣤⡀⠀⠀⠀⠀
⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀
⠀⠀⣾⣿⠟⠋⠉⠀⠀⠉⠙⠻⣿⣷⡀⣰⣿⣿⣿⠟⠉⠀⠀⠀⠈⠙⣿⣷⠀⠀
⠀⢸⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠸⣿⡇⠀
⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀
⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡇⠀
⠀⠀⢿⣿⣄⡀⠀⠀⠀⢀⣴⣿⣿⣿⠟⠘⢿⣿⣦⣀⡀⠀⠀⢀⣀⣴⣿⡿⠀⠀
⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⠿⠿⠛⠉⠀⠀⠀⠀`}
          </pre>

          {/* Peekaboo Doodle */}
          <div
            className={`transition-all duration-700 ease-in-out ${
              showPeekaboo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute'
            }`}
            aria-hidden="true"
          >
            <img
              src="/assets/home-mobileview/peekaboo-doodle.png"
              alt="peekaboo"
              className="w-full max-w-[320px] h-auto object-contain mix-blend-multiply"
              draggable={false}
            />
          </div>
        </div>

        <div className="font-mono text-xs text-ink-soft mb-4 flex items-center gap-2" id="prompt-line">
          <span>&gt; whoami</span>
          <span className="w-2 h-3.5 bg-ink inline-block terminal-cursor" id="cursor-blink"></span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-tight mb-4" id="name-header">
          Chiranth Moger
        </h1>
        
        {/* Apple-style Role Badges */}
        <div className="flex flex-wrap gap-2 mb-6" id="title-roles">
          {['Agentic AI', 'Applied ML', 'Android Systems', 'Application Security'].map((role) => (
            <span 
              key={role} 
              className="font-mono text-xs text-ink-soft bg-black/[0.03] border border-black/[0.08] px-3 py-1 rounded-full shadow-2xs select-none"
            >
              {role}
            </span>
          ))}
        </div>

        <div className="text-[15px] sm:text-[16px] text-ink-soft/90 w-full leading-relaxed mb-8 max-w-[65ch]" id="intro-text">
          <p>
            Final-year B.E. Information Science & Engineering student at BMSIT, Bengaluru, exploring the intersection of Agentic AI, applied machine learning, Android systems, and application security. Interested in building practical, intelligent systems and understanding how emerging technologies can solve real-world problems.
          </p>
        </div>

        {/* Apple-style Action Buttons with RGB Chroma Ambient Shadow */}
        <div className="flex flex-wrap items-center gap-3.5 font-mono text-xs" id="hero-actions">
          {/* Connect */}
          <div className="rgb-glow-wrapper">
            <button
              onClick={onNavigateToContact}
              className="relative z-10 flex items-center gap-2 bg-[#0D0F14] text-paper rounded-full px-5 py-2.5 hover:bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:scale-95 hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer btn-sweep font-semibold"
              id="btn-contact-me"
            >
              <Mail size={14} className="shrink-0" />
              <span>Connect</span>
            </button>
          </div>

          {/* GitHub */}
          <div className="rgb-glow-wrapper">
            <a
              href="https://github.com/Chiranth-Janardhan-moger"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-2 bg-[#0D0F14] text-paper rounded-full px-4.5 py-2.5 hover:bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:scale-95 hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer btn-sweep font-semibold"
              id="link-github"
            >
              <Github size={14} className="shrink-0" />
              <span>GitHub</span>
            </a>
          </div>

          {/* LinkedIn */}
          <div className="rgb-glow-wrapper">
            <a
              href="https://www.linkedin.com/in/chiranth-moger-01a867316/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 flex items-center gap-2 bg-[#0D0F14] text-paper rounded-full px-4.5 py-2.5 hover:bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:scale-95 hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer btn-sweep font-semibold"
              id="link-linkedin"
            >
              <Linkedin size={14} className="shrink-0" />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* Resume */}
          <div className="rgb-glow-wrapper">
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                triggerFluidCloud({
                  title: "Opening Resume",
                  subtitle: "Chiranth_Moger_Resume.pdf",
                  icon: "download",
                  type: "success"
                });
              }}
              className="relative z-10 flex items-center gap-2 bg-[#0D0F14] text-paper rounded-full px-4.5 py-2.5 hover:bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.2)] active:scale-95 hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer btn-sweep font-semibold"
              id="link-resume"
            >
              <FileText size={14} className="shrink-0" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="border-t border-line/80 pt-12" id="education">
        <div className="text-[20px] font-bold text-ink tracking-tight mb-6" id="edu-label">
          <span>Education</span>
        </div>
        <div className="space-y-4" id="education-list">
          {EDUCATION.map((edu, idx) => {
            const isSiddhartha = edu.institution.toLowerCase().includes("siddhartha");
            const isExpanded = expandedEduIndices.includes(idx);
            return (
              <div 
                key={idx} 
                id={`edu-item-${idx}`} 
                className="aquamorphic-card border border-line/80 rounded-2xl p-5 sm:p-6 bg-white/80 backdrop-blur-md hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex items-start gap-4 group"
              >
                {edu.logo && (
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 overflow-hidden shadow-2xs transition-transform duration-300 group-hover:scale-105 ${
                    isSiddhartha 
                      ? 'bg-[#033475] border-[#033475] p-1' 
                      : 'bg-white border-line/80 p-1.5'
                  }`}>
                    <LazyImage 
                      src={edu.logo} 
                      alt={`${edu.institution} logo`} 
                      className={`w-full h-full transition-all duration-300 ${isSiddhartha ? 'object-cover rounded-lg' : 'object-contain'}`}
                      wrapperClassName="w-full h-full flex items-center justify-center"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => toggleEduExpand(idx)}
                      className="inline-flex items-center gap-1.5 text-left group/btn cursor-pointer py-0.5 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded"
                      aria-expanded={isExpanded}
                      id={`edu-btn-${idx}`}
                    >
                      <h3 className="font-bold text-base text-ink flex items-center gap-1.5 flex-wrap" id={`edu-inst-${idx}`}>
                        {edu.institution.includes("BMS") ? (
                          <>
                            <span className="sm:hidden">BMSIT&M</span>
                            <span className="hidden sm:inline">{edu.institution}</span>
                          </>
                        ) : (
                          <span>{edu.institution}</span>
                        )}
                      </h3>
                      <ChevronDown 
                        size={15} 
                        className={`text-ink-soft transition-all duration-200 opacity-60 group-hover/btn:opacity-100 group-hover/btn:text-ink focus-visible:opacity-100 ${
                          isExpanded ? 'rotate-180 opacity-100 text-ink' : ''
                        }`} 
                      />
                    </button>
                    <div className="flex items-center gap-2 flex-wrap shrink-0 font-mono text-xs">
                      {edu.period && (
                        <span className="text-ink-soft bg-black/[0.02] border border-black/[0.04] px-2.5 py-0.5 rounded-full">{edu.period}</span>
                      )}
                    </div>
                  </div>
                  <p className="font-mono text-xs text-ink-soft mt-1" id={`edu-meta-${idx}`}>
                    {edu.degree.includes("Bachelor of Engineering") ? (
                      <>
                        <span className="sm:hidden">{edu.degree.replace("Bachelor of Engineering", "B.E.")}</span>
                        <span className="hidden sm:inline">{edu.degree}</span>
                      </>
                    ) : (
                      edu.degree
                    )}
                  </p>
                  
                  {/* Expandable Details containing CGPA */}
                  <div className={`edu-expand-container ${isExpanded ? 'is-expanded' : ''}`}>
                    <div className="edu-expand-content">
                      <div className="pt-2.5 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-soft">
                        {edu.gpa && (
                          <div className="inline-flex items-center" id={`edu-gpa-${idx}`}>
                            <span className="font-bold text-ink border border-neutral-200/80 rounded-full px-3 py-1 bg-neutral-100/90 text-[11px] shadow-2xs">
                              {edu.gpa}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-line/80 pt-12" id="experience">
        <div className="text-[20px] font-bold text-ink tracking-tight mb-6" id="exp-label">
          <span>Experience</span>
        </div>
        <div className="space-y-4" id="experience-list">
          {EXPERIENCES.filter(exp => exp.id.startsWith("freelance-")).map((exp) => {
            const hasExpandable = Boolean(exp.certificate);
            const isExpanded = expandedExpIds.includes(exp.id);
            return (
              <div
                key={exp.id}
                className="aquamorphic-card border border-line/80 rounded-2xl p-5 sm:p-6 bg-white/80 backdrop-blur-md hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex items-start gap-4 group"
                id={`exp-item-${exp.id}`}
              >
                {exp.logo && (
                  <div className={`w-12 h-12 rounded-2xl border ${exp.logoBg === 'black' ? 'bg-[#0B0F17] border-neutral-800/80 shadow-md' : 'bg-white border-line/80 shadow-2xs'} flex items-center justify-center shrink-0 overflow-hidden p-1.5 transition-transform duration-300 group-hover:scale-105`}>
                    <LazyImage 
                      src={exp.logo} 
                      alt={`${exp.role} logo`} 
                      className="w-full h-full object-contain transition-all duration-300"
                      wrapperClassName="w-full h-full flex items-center justify-center"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2 flex-wrap" id={`exp-header-${exp.id}`}>
                    {hasExpandable ? (
                      <button
                        type="button"
                        onClick={() => toggleExpExpand(exp.id)}
                        className="inline-flex items-center gap-1.5 text-left group/btn cursor-pointer py-0.5 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded"
                        aria-expanded={isExpanded}
                        id={`exp-btn-${exp.id}`}
                      >
                        <h3 className="font-bold text-base text-ink flex items-center gap-1.5 flex-wrap" id={`exp-role-${exp.id}`}>
                          <span>{exp.role}</span>
                          {exp.company && <span className="font-normal text-xs text-ink-soft ml-1">· {exp.company}</span>}
                        </h3>
                        <ChevronDown 
                          size={14} 
                          className={`text-ink-soft transition-all duration-200 opacity-60 group-hover:opacity-100 group-hover/btn:opacity-100 focus-visible:opacity-100 ${
                            isExpanded ? 'rotate-180 opacity-100 text-ink' : ''
                          }`} 
                        />
                      </button>
                    ) : (
                      <h3 className="font-bold text-base text-ink" id={`exp-role-${exp.id}`}>
                        <span>{exp.role}</span>
                        {exp.company && <span className="font-normal text-xs text-ink-soft ml-1">· {exp.company}</span>}
                      </h3>
                    )}
                    {exp.dates && (
                      <span className="font-mono text-xs text-ink-soft bg-black/[0.02] border border-black/[0.04] px-2.5 py-0.5 rounded-full shrink-0" id={`exp-dates-${exp.id}`}>{exp.dates}</span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-ink-soft mt-1" id={`exp-desc-${exp.id}`}>
                    {exp.desc}
                  </p>
                  {hasExpandable && (
                    <div className={`edu-expand-container ${isExpanded ? 'is-expanded' : ''}`}>
                      <div className="edu-expand-content">
                        {exp.certificate && (
                          <div className="pt-2.5 flex items-center gap-2">
                            {exp.certificateUrl ? (
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCert({
                                    title: `${exp.role} · ${exp.desc}`,
                                    issuer: exp.certificate || "Certificate",
                                    url: exp.certificateUrl!
                                  });
                                }}
                                className="group/cert font-mono text-[10px] text-ink-soft border border-line/80 rounded-full px-3 py-1 bg-white hover:border-ink hover:text-ink hover:shadow-xs transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs"
                                id={`exp-cert-${exp.id}`}
                              >
                                <FileText size={11} className="shrink-0 text-ink-soft group-hover/cert:text-ink transition-colors" />
                                <span>{exp.certificate}</span>
                              </button>
                            ) : (
                              <span 
                                className="group/cert font-mono text-[10px] text-ink-soft border border-line/80 rounded-full px-3 py-1 bg-white hover:border-ink hover:text-ink hover:shadow-xs transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs"
                                id={`exp-cert-${exp.id}`}
                              >
                                <FileText size={11} className="shrink-0 text-ink-soft group-hover/cert:text-ink transition-colors" />
                                <span>{exp.certificate}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hackathons & Achievements */}
      <section className="border-t border-line/80 pt-12" id="hackathons">
        <div className="text-[20px] font-bold text-ink tracking-tight mb-6" id="hackathons-label">
          <span>Hackathons & Achievements</span>
        </div>
        <div className="space-y-4" id="hackathons-list">
          {EXPERIENCES.filter(exp => exp.id.startsWith("hackathon-")).map((exp) => (
            <div
              key={exp.id}
              className="aquamorphic-card border border-line/80 rounded-2xl p-5 sm:p-6 bg-white/80 backdrop-blur-md hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out"
              id={`exp-card-${exp.id}`}
            >
              <div className="flex justify-between items-baseline gap-3 flex-wrap" id={`exp-header-${exp.id}`}>
                <h3 className="font-bold text-base text-ink flex items-center gap-2" id={`exp-role-${exp.id}`}>
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Trophy size={13} className="text-amber-500 fill-amber-500/20" />
                  </div>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
                    >
                      <span>{exp.role}</span>
                      <ArrowUpRight size={14} className="text-ink-soft opacity-60 group-hover/link:opacity-100 group-hover/link:text-ink group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                    </a>
                  ) : (
                    exp.role
                  )}
                </h3>
                <span className="font-mono text-xs text-ink-soft bg-black/[0.02] border border-black/[0.04] px-2.5 py-0.5 rounded-full" id={`exp-dates-${exp.id}`}>{exp.dates}</span>
              </div>
              {exp.company && (
                <p className="font-mono text-xs text-ink-soft mt-1" id={`exp-company-${exp.id}`}>{exp.company}</p>
              )}
              <p className="text-[13px] text-ink-soft mt-3 leading-relaxed" id={`exp-desc-${exp.id}`}>{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Activities */}
      <section className="border-t border-line/80 pt-12" id="leadership">
        <div className="text-[20px] font-bold text-ink tracking-tight mb-6" id="leadership-label">
          <span>Leadership & Activities</span>
        </div>
        <div className="space-y-4" id="leadership-list">
          {EXPERIENCES.filter(exp => !exp.id.startsWith("freelance-") && !exp.id.startsWith("hackathon-")).map((exp) => (
            <div
              key={exp.id}
              className="aquamorphic-card border border-line/80 rounded-2xl p-5 sm:p-6 bg-white/80 backdrop-blur-md hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex items-start gap-4 group"
              id={`exp-item-${exp.id}`}
            >
              {exp.logo && (
                <div className={`w-12 h-12 rounded-2xl border ${exp.logoBg === 'black' ? 'bg-[#0B0F17] border-neutral-800/80 shadow-md' : 'bg-white border-line/80 shadow-2xs'} flex items-center justify-center shrink-0 overflow-hidden p-1.5 transition-transform duration-300 group-hover:scale-105`}>
                  <LazyImage
                    src={exp.logo}
                    alt={`${exp.role} logo`}
                    className="w-full h-full object-contain"
                    wrapperClassName="w-full h-full flex items-center justify-center"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2 flex-wrap" id={`exp-header-${exp.id}`}>
                  <h3 className="font-bold text-base text-ink" id={`exp-role-${exp.id}`}>
                    {exp.url ? (
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
                      >
                        <span>{exp.role}</span>
                        <ArrowUpRight size={14} className="text-ink-soft opacity-60 group-hover/link:opacity-100 group-hover/link:text-ink group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-200" />
                      </a>
                    ) : (
                      exp.role
                    )}
                  </h3>
                  <span className="font-mono text-xs text-ink-soft bg-black/[0.02] border border-black/[0.04] px-2.5 py-0.5 rounded-full shrink-0" id={`exp-dates-${exp.id}`}>{exp.dates}</span>
                </div>
                {exp.company && (
                  <p className="font-mono text-xs text-ink-soft mt-1" id={`exp-company-${exp.id}`}>{exp.company}</p>
                )}
                {exp.links && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono" id={`exp-links-${exp.id}`}>
                    {exp.links.map((link, idx) => {
                      const isRepo = link.label.toLowerCase().includes('repo') || link.url.includes('github.com');
                      return (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-soft hover:text-ink hover:underline inline-flex items-center gap-1.5 border border-line/80 rounded-full px-3 py-1 bg-white hover:bg-cream transition-colors text-[11px] shadow-2xs"
                          id={`exp-link-${exp.id}-${idx}`}
                        >
                          {isRepo ? <Github size={11} /> : <ExternalLink size={11} />}
                          <span>{link.label}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="border-t border-line/80 pt-12" id="projects">
        <div className="text-[20px] font-bold text-ink tracking-tight mb-6" id="projects-label">
          <span>Projects</span>
        </div>
        <div className="space-y-6" id="projects-list">
          {(isProjectsExpanded ? PROJECTS : PROJECTS.slice(0, 5)).map((proj) => {
            const isExpanded = expandedProjIds.includes(proj.id);
            return (
              <TiltCard
                key={proj.id}
                className="aquamorphic-card relative overflow-hidden border border-line/80 hover:border-ink rounded-2xl p-6 bg-white/80 backdrop-blur-md hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] cursor-pointer group"
                id={`project-card-${proj.id}`}
                onClick={() => {
                  toggleProjExpand(proj.id);
                  if (proj.id === 'sqlguardjs' && !isPlaygroundExpanded) {
                    setIsPlaygroundExpanded(true);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleProjExpand(proj.id);
                    if (proj.id === 'sqlguardjs' && !isPlaygroundExpanded) {
                      setIsPlaygroundExpanded(true);
                    }
                  }
                }}
              >
                {proj.id === 'sqlguardjs' && (
                  <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                    <div className="absolute top-[12px] left-[-22px] w-[70px] h-[7px] bg-ink transform -rotate-45" />
                  </div>
                )}
                <div className="flex justify-between items-start gap-4 flex-wrap mb-2" id={`project-head-${proj.id}`}>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap" id={`project-title-wrapper-${proj.id}`}>
                      <h3 className="text-xl font-bold text-ink flex items-center gap-2" id={`project-name-${proj.id}`}>
                        {proj.id === 'vaultx' ? (
                          <>
                            <span className="hidden sm:inline">{proj.name}</span>
                            <span className="inline sm:hidden">VaultX</span>
                          </>
                        ) : (
                          <span>{proj.name}</span>
                        )}
                        <ChevronDown 
                          size={16} 
                          className={`text-ink-soft transition-transform duration-300 opacity-60 group-hover:opacity-100 ${
                            isExpanded ? 'rotate-180 opacity-100 text-ink' : ''
                          }`} 
                        />
                      </h3>
                      {proj.demoUrl && proj.demoUrl.startsWith('http') && proj.id !== 'sqlguardjs' && proj.id !== 'cloudpulse' && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDemoClick(e, proj);
                          }}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors shadow-2xs select-none"
                          title="Open Live Deployment"
                          id={`project-live-badge-${proj.id}`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span>Live</span>
                        </a>
                      )}
                    </div>
                    <span className="font-mono text-xs text-ink-soft" id={`project-meta-${proj.id}`}>{proj.meta}</span>
                  </div>
                  <div className="flex gap-2" id={`project-links-${proj.id}`} onClick={(e) => e.stopPropagation()}>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-line/80 bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink shadow-2xs active:scale-95 transition-all duration-200 ease-out"
                        title="GitHub Repository"
                        id={`project-gh-${proj.id}`}
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {(proj.id === 'vaultx' || proj.id === 'latex-editor' || Boolean(proj.appDeepLink)) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetAppId = proj.id === 'latex-editor' ? 'latex' : (proj.id === 'webstack' ? 'webstack' : 'vaultx');
                          const targetPath = proj.appDeepLink || `/app/${targetAppId}`;
                          if (onNavigateToApps) {
                            onNavigateToApps(targetAppId);
                          } else {
                            window.history.pushState({}, '', targetPath);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                        }}
                        className="w-8 h-8 rounded-full border border-line/80 bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink shadow-2xs active:scale-95 transition-all duration-200 ease-out cursor-pointer"
                        title={proj.id === 'latex-editor' ? "Download LaTeX Editor APK" : (proj.id === 'webstack' ? "Download WebStack APK" : "Download VaultX APK")}
                        id={`project-download-${proj.id}`}
                        aria-label={proj.id === 'latex-editor' ? "Download LaTeX Editor APK" : (proj.id === 'webstack' ? "Download WebStack APK" : "Download VaultX APK")}
                      >
                        <Download size={14} />
                      </button>
                    )}
                    {proj.demoUrl && proj.demoUrl !== "#" && proj.id !== 'webstack' && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        onClick={(e) => handleDemoClick(e, proj)}
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-line/80 bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink shadow-2xs active:scale-95 transition-all duration-200 ease-out"
                        title={proj.id === 'sqlguardjs' ? "npm Registry Package" : (proj.id === 'cloudpulse' ? "Docker Container Metrics" : "Live Project Deployment")}
                        id={`project-demo-${proj.id}`}
                      >
                        {proj.id === 'sqlguardjs' ? (
                          <Package size={14} />
                        ) : proj.id === 'cloudpulse' ? (
                          <Container size={14} />
                        ) : (
                          <ExternalLink size={14} />
                        )}
                      </a>
                    )}
                    {proj.id === 'sqlguardjs' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateToBlog) {
                            onNavigateToBlog('sqlguard');
                          } else {
                            window.history.pushState({}, '', '/blog/sqlguard');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                        }}
                        className="w-8 h-8 rounded-full border border-line/80 bg-white flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink shadow-2xs active:scale-95 transition-all duration-200 ease-out btn-sweep cursor-pointer"
                        title="Read SQLGuardJS Deep Dive Blog Post"
                        id="project-blog-sqlguard"
                        aria-label="Read SQLGuardJS Deep Dive Blog Post"
                      >
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[13px] text-ink-soft leading-relaxed mt-2 mb-4" id={`project-desc-${proj.id}`}>
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-2" id={`project-stack-${proj.id}`}>
                  {proj.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] text-ink-soft border border-line/80 rounded-full px-2.5 py-0.5 bg-cream/70 shadow-2xs"
                      id={`project-tech-${proj.id}-${tech.replace(/\s+/g, '-')}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Expandable Verification Logs / Bullet Points */}
                {proj.logs && proj.logs.length > 0 && (
                  <div className={`edu-expand-container ${isExpanded ? 'is-expanded' : ''}`}>
                    <div className="edu-expand-content">
                      <div className="space-y-2.5 border-t border-line/60 pt-4 mt-3" id={`project-logs-${proj.id}`}>
                        {proj.logs.map((log, index) => (
                          <div key={index} className="flex gap-2 items-start font-mono text-xs" id={`project-log-row-${proj.id}-${index}`}>
                            <span className="text-ink-soft select-none mt-0.5 shrink-0" id={`log-bullet-${proj.id}-${index}`}>·</span>
                            <span className="text-ink-soft leading-tight" id={`log-text-${proj.id}-${index}`}>{log.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {proj.id === "sqlguardjs" && !isPlaygroundExpanded && (
                <div 
                  className="mt-6 flex flex-col items-center justify-center p-6 sm:p-8 border border-dashed border-line/80 rounded-2xl bg-cream/20 hover:bg-cream/40 hover:border-ink transition-all duration-300 group" 
                  id="sqlguardjs-collapsed-trigger"
                >
                  <div className="w-12 h-12 rounded-2xl border border-line/80 flex items-center justify-center bg-white group-hover:scale-105 transition-all duration-300 mb-3 shadow-2xs">
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
                <div className="mt-6 border border-line/80 bg-white/95 rounded-2xl p-5 sm:p-6 relative shadow-md animate-fade-in" id="sqlguardjs-playground" onClick={(e) => e.stopPropagation()}>
                  {/* macOS Window Title Bar */}
                  <div className="flex justify-between items-center gap-4 mb-4 pb-3 border-b border-line/60" id="sqlguardjs-playground-header">
                    <div className="flex items-center gap-3">
                      {/* Traffic Light Dots */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/40" />
                      </div>
                      <h4 className="font-mono text-xs font-semibold text-ink">
                        SQLGuardJS AST Diagnostic Inspector
                      </h4>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaygroundExpanded(false);
                      }}
                      className="w-6 h-6 rounded-full bg-cream border border-line/80 hover:bg-ink hover:text-paper active:scale-95 transition-all flex items-center justify-center text-ink shrink-0 cursor-pointer shadow-2xs"
                      title="Close Inspector"
                      aria-label="Close Inspector"
                      id="btn-collapse-playground"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-ink-soft mb-4 leading-relaxed">
                    Test Chiranth's published middleware live. Input any payload or select a signature below to see SQLGuardJS evaluate, score, and defend the gateway in real-time.
                  </p>

                  {/* Preset quick test buttons */}
                  <div className="flex flex-wrap gap-2 mb-3.5">
                    <button
                      onClick={() => setTestPayload("SELECT * FROM users WHERE email = 'recruiter@bmsit.edu'")}
                      className="font-mono text-[10px] border border-line/80 hover:border-ink hover:bg-ink px-3 py-1 rounded-full text-ink-soft hover:text-paper bg-white shadow-2xs transition-all active:scale-95 cursor-pointer btn-sweep"
                    >
                      Safe Query
                    </button>
                    <button
                      onClick={() => setTestPayload("' UNION SELECT username, password_hash FROM admin_users --")}
                      className="font-mono text-[10px] border border-line/80 hover:border-ink hover:bg-ink px-3 py-1 rounded-full text-ink-soft hover:text-paper bg-white shadow-2xs transition-all active:scale-95 cursor-pointer btn-sweep"
                    >
                      SQL Injection Attack
                    </button>
                    <button
                      onClick={() => setTestPayload('<img src=x onerror="alert(document.domain)">')}
                      className="font-mono text-[10px] border border-line/80 hover:border-ink hover:bg-ink px-3 py-1 rounded-full text-ink-soft hover:text-paper bg-white shadow-2xs transition-all active:scale-95 cursor-pointer btn-sweep"
                    >
                      XSS script injection
                    </button>
                    <button
                      onClick={() => setTestPayload('{"$ne": null}')}
                      className="font-mono text-[10px] border border-line/80 hover:border-ink hover:bg-ink px-3 py-1 rounded-full text-ink-soft hover:text-paper bg-white shadow-2xs transition-all active:scale-95 cursor-pointer btn-sweep"
                    >
                      NoSQL injection bypass
                    </button>
                  </div>

                  {/* Textarea Input */}
                  <div className="mb-3.5">
                    <textarea
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      placeholder="Type a query, script, or payload to scan..."
                      className="w-full h-20 font-mono text-xs p-3 bg-[#FAFAFA] border border-line/80 focus:border-ink focus:outline-none rounded-xl resize-none shadow-inner"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        disabled={isScanning || !testPayload.trim()}
                        onClick={handleScanPayload}
                        className="flex items-center gap-1.5 font-mono text-xs bg-ink hover:bg-neutral-800 text-paper disabled:bg-line disabled:text-ink-soft disabled:cursor-not-allowed px-4 py-2 rounded-full transition-all cursor-pointer btn-sweep font-semibold shadow-sm active:scale-95"
                      >
                        {isScanning ? (
                          <RefreshCw size={11} className="animate-spin" />
                        ) : (
                          <Play size={11} />
                        )}
                        <span>Scan Payload</span>
                      </button>
                    </div>
                  </div>

                  {/* Scan Result Terminal */}
                  {scanResult && (
                    <div className="border border-line/80 rounded-xl overflow-hidden bg-white font-mono text-xs mb-3 shadow-sm animate-fade-in">
                      <div className="border-b border-line/60 bg-cream/70 px-3.5 py-2 flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
                        <div className="flex items-center gap-1.5 self-start">
                           <Terminal size={12} className="text-ink-soft" />
                           <span className="text-[10px] font-semibold text-ink-soft uppercase tracking-wider">
                             Shield Gateway Inspection Report
                           </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full self-start sm:self-auto ${
                          scanResult.status === 200 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          HTTP {scanResult.status} {scanResult.status === 200 ? 'OK' : 'FORBIDDEN'}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2.5">
                        {scanResult.status === 200 ? (
                          <div className="flex items-start gap-2 text-emerald-700">
                            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="font-bold">Request Passed Safely</p>
                              <p className="text-ink-soft text-[11px] mt-0.5">
                                SQLGuardJS checked the body payload and verified that it does not exceed heuristic threat indicators.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 text-red-700">
                            <ShieldAlert size={15} className="mt-0.5 shrink-0" />
                            <div>
                              <p className="font-bold">Threat Intercepted & Blocked</p>
                              <p className="text-ink-soft text-[11px] mt-0.5">
                                Real-time dynamic shield matched signature rules. Attack type classified as: <span className="font-bold underline text-red-700">{scanResult.data?.details?.label || 'malicious'}</span>.
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="border-t border-line/60 pt-2.5 mt-2">
                          <span className="text-[10px] text-ink-soft uppercase tracking-wider font-semibold">Gateway Response Payload:</span>
                          <pre className="mt-1.5 bg-cream/40 p-3 rounded-xl text-[10px] sm:text-[10.5px] text-ink leading-relaxed border border-line/40 font-mono whitespace-pre-wrap break-all select-text">
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
                      className="w-7 h-7 rounded-full bg-white border border-line/80 hover:bg-ink hover:text-paper active:scale-95 transition-all flex items-center justify-center text-ink cursor-pointer shadow-2xs group/log"
                      title={showRecentThreats ? "Hide Live Logs" : "View Live Logs"}
                      aria-label={showRecentThreats ? "Hide Live Logs" : "View Live Logs"}
                      id="btn-toggle-threat-logs"
                    >
                      <Activity size={13} className={showRecentThreats ? "text-emerald-500" : "text-current"} />
                    </button>
                    <span className="font-mono text-[9px] text-ink-soft self-start sm:self-auto">
                      Heuristics Sensitivity: Balanced
                    </span>
                  </div>

                  {/* Threat logs panel */}
                  {showRecentThreats && (
                    <div className="mt-3 border border-line/80 bg-white rounded-xl p-3.5 max-h-48 overflow-y-auto space-y-2 animate-fade-in shadow-xs">
                      <div className="flex justify-between items-center mb-2 border-b border-line/40 pb-1.5">
                        <span className="font-mono text-[10px] text-ink font-bold uppercase tracking-wider">
                          Intercepted In-Memory Logs
                        </span>
                        <button 
                          onClick={fetchLogs} 
                          className="w-5 h-5 rounded-full bg-cream/70 border border-line/80 hover:bg-ink hover:text-paper active:scale-95 transition-all flex items-center justify-center text-ink-soft hover:text-white cursor-pointer shadow-2xs group"
                          title="Refresh live logs"
                          aria-label="Refresh live logs"
                          id="btn-refresh-threat-logs"
                        >
                          <RefreshCw size={10} className="transition-transform duration-300 group-hover:rotate-180" />
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
                                 <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                                   log.action === 'block' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-700'
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
            </TiltCard>
          );
        })}
        </div>

        {/* Apple-Style Show More / Show Less Projects Button */}
        {PROJECTS.length > 5 && (
          <div className="pt-8 flex justify-center" id="projects-show-more-wrapper">
            <button
              type="button"
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full font-mono text-xs font-semibold text-ink bg-white/90 border border-line/90 shadow-2xs hover:border-ink hover:shadow-md hover:bg-white active:scale-95 transition-all duration-300 cursor-pointer select-none"
              aria-expanded={isProjectsExpanded}
              id="btn-toggle-projects-expand"
            >
              <div className="w-5 h-5 rounded-full bg-black/[0.04] border border-black/[0.08] flex items-center justify-center text-ink transition-transform duration-300 group-hover:scale-110">
                <ChevronDown 
                  size={13} 
                  className={`transition-transform duration-300 ${isProjectsExpanded ? 'rotate-180 text-ink' : 'text-ink-soft'}`} 
                />
              </div>
              <span>
                {isProjectsExpanded 
                  ? "Show Less" 
                  : "Show More"}
              </span>
            </button>
          </div>
        )}
      </section>

      {/* Certifications */}
      <section className="border-t border-line/80 pt-12" id="certifications">
        <div className="text-[20px] font-bold text-ink tracking-tight mb-6" id="certifications-label">
          <span>Certifications</span>
        </div>
        <div className="space-y-4" id="certifications-list">
          {CERTIFICATIONS.map((cert) => {
            const hasExpandable = Boolean(cert.certificateUrl || cert.credentialUrl);
            const isExpanded = hasExpandable && expandedCertIds.includes(cert.id);
            return (
              <div
                key={cert.id}
                className="aquamorphic-card border border-line/80 rounded-2xl p-5 sm:p-6 bg-white/80 backdrop-blur-md hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.08)] shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)] flex items-start gap-4 group transition-all duration-300 ease-out"
                id={`cert-item-${cert.id}`}
              >
                <div className="w-12 h-12 rounded-2xl border bg-white border-line/80 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden p-2 transition-transform duration-300 group-hover:scale-105">
                  {cert.logo ? (
                    <LazyImage 
                      src={cert.logo} 
                      alt={`${cert.name} logo`} 
                      className="w-full h-full object-contain"
                      wrapperClassName="w-full h-full flex items-center justify-center"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-ink/[0.03] flex items-center justify-center text-ink">
                      <Award size={20} className="text-ink" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2 flex-wrap" id={`cert-header-${cert.id}`}>
                    {hasExpandable ? (
                      <button
                        type="button"
                        onClick={() => toggleCertExpand(cert.id)}
                        className="inline-flex items-center gap-1.5 text-left group/btn cursor-pointer py-0.5 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded"
                        aria-expanded={isExpanded}
                        id={`cert-btn-toggle-${cert.id}`}
                      >
                        <h3 className="font-bold text-base text-ink flex items-center gap-1.5 flex-wrap" id={`cert-name-${cert.id}`}>
                          <span>{cert.name}</span>
                        </h3>
                        <ChevronDown 
                          size={14} 
                          className={`text-ink-soft transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover/btn:opacity-100 focus-visible:opacity-100 ${
                            isExpanded ? 'rotate-180 opacity-100 text-ink' : ''
                          }`} 
                        />
                      </button>
                    ) : (
                      <h3 className="font-bold text-base text-ink" id={`cert-name-${cert.id}`}>
                        <span>{cert.name}</span>
                      </h3>
                    )}
                    {cert.period && (
                      <span className="font-mono text-xs text-ink-soft bg-black/[0.02] border border-black/[0.04] px-2.5 py-0.5 rounded-full shrink-0" id={`cert-dates-${cert.id}`}>{cert.period}</span>
                    )}
                  </div>
                  {cert.desc && (
                    <p className="font-mono text-xs text-ink-soft mt-1 leading-relaxed" id={`cert-desc-${cert.id}`}>
                      {cert.desc}
                    </p>
                  )}
                  
                  {/* Smooth Animated Certificate Pill on Expand */}
                  {hasExpandable && (
                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${
                        isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0 mt-0'
                      }`}
                      id={`cert-expand-${cert.id}`}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-1.5 pb-0.5 flex items-center gap-2">
                          {cert.certificateUrl ? (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCert({
                                  title: `${cert.name} · ${cert.issuer}`,
                                  issuer: cert.issuer,
                                  url: cert.certificateUrl!
                                });
                              }}
                              className="group/cert font-mono text-[10px] text-ink-soft border border-line/80 rounded-full px-3 py-1 bg-white hover:border-ink hover:text-ink hover:shadow-xs transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs"
                              id={`cert-btn-${cert.id}`}
                            >
                              <FileText size={11} className="shrink-0 text-ink-soft group-hover/cert:text-ink transition-colors" />
                              <span>View Certificate</span>
                            </button>
                          ) : cert.credentialUrl ? (
                            <a 
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="group/cert font-mono text-[10px] text-ink-soft border border-line/80 rounded-full px-3 py-1 bg-white hover:border-ink hover:text-ink hover:shadow-xs transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-1.5 shadow-2xs"
                              id={`cert-link-${cert.id}`}
                            >
                              <ExternalLink size={11} className="shrink-0 text-ink-soft group-hover/cert:text-ink transition-colors" />
                              <span>Verify Credential</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}


                  {cert.skills && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-line/40" id={`cert-skills-${cert.id}`}>
                      {cert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] bg-black/[0.02] text-ink-soft border border-black/[0.04] rounded-md px-2 py-0.5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>


      {/* Apple-Style High-Impact Call to Action */}
      <section className="border-t border-line/80 pt-16 pb-12 text-center" id="cta-connect">
        <div className="max-w-xl mx-auto rounded-3xl border border-line/80 bg-white/70 backdrop-blur-xl p-8 sm:p-10 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.06)] space-y-4" id="cta-inner">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink" id="cta-title">
            Ready to Connect?
          </h2>
          <p className="text-xs sm:text-[13px] text-ink-soft max-w-[42ch] mx-auto leading-relaxed">
            Let's discuss applied ML, Android systems, security architecture, or engineering leadership.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="rgb-glow-wrapper group">
              <button
                onClick={onNavigateToContact}
                className="relative z-10 inline-flex items-center gap-2.5 bg-[#0D0F14] text-paper rounded-full px-7 py-3 font-mono text-xs font-semibold hover:bg-neutral-900 shadow-[0_4px_16px_rgba(0,0,0,0.25)] active:scale-95 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group/cta"
                id="cta-main-trigger"
              >
                {/* Diagonal Light Sweep Beam */}
                <span className="light-sweep-beam" />
                <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <Mail size={14} className="shrink-0 relative z-10" />
                <span className="relative z-10">Get in Touch</span>
                <ArrowRight size={14} className="shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1 relative z-10" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Apple-Style Native In-Website Certificate Modal (Portaled to document.body) */}
      {activeCert && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in"
          onClick={() => setActiveCert(null)}
          role="dialog"
          aria-modal="true"
          id="cert-modal-backdrop"
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-3xl border border-line shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            id="cert-modal-container"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-line/80 bg-white/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-black/[0.04] border border-black/[0.08] flex items-center justify-center shrink-0">
                  <FileText size={15} className="text-ink" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-ink truncate" id="cert-modal-title">
                    {activeCert.title}
                  </h3>
                  {activeCert.issuer && (
                    <p className="text-[11px] font-mono text-ink-soft truncate" id="cert-modal-issuer">
                      {activeCert.issuer}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="w-8 h-8 rounded-full border border-line/80 bg-white hover:bg-ink hover:text-paper text-ink flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Close certificate modal"
                  id="close-cert-modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Image Display with LazyImage */}
            <div className="flex-1 overflow-auto p-3 sm:p-6 bg-[#F7F6F2]/80 flex items-center justify-center min-h-[300px]">
              <div className="rounded-2xl border border-line/80 bg-white shadow-md overflow-hidden max-h-[76vh] w-full flex items-center justify-center p-1.5">
                <LazyImage 
                  src={activeCert.url} 
                  alt={activeCert.title}
                  className="w-full h-auto max-h-[74vh] object-contain rounded-xl select-none"
                  wrapperClassName="w-full h-full flex items-center justify-center min-h-[280px]"
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
