import React, { useState } from 'react';
import { 
  Palette, 
  ExternalLink, 
  ChevronDown, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Layout, 
  Sliders, 
  ShieldCheck, 
  Eye, 
  Lock, 
  Navigation
} from 'lucide-react';
import { DESIGNS } from '../data';
import { DesignProject } from '../types';

export default function DesignsView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedDesignIds, setExpandedDesignIds] = useState<string[]>([]);

  const categories = ['All', 'Design System', 'Mobile UI', 'Security UX'];

  const filteredDesigns = selectedCategory === 'All'
    ? DESIGNS
    : DESIGNS.filter(item => item.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedDesignIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderInteractivePreview = (previewType: string, designId: string) => {
    if (previewType === 'minimal-system') {
      return (
        <div className="w-full bg-[#fcfbf9] border border-line rounded-xl p-5 select-none font-sans shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-2 font-mono text-[11px] text-ink-soft">
            <span>TOKENS // MONOCRAFT_V1</span>
            <span className="text-ink font-bold">1px RIGID SCALE</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg border border-line bg-paper text-center">
              <span className="font-bold text-xs text-ink block">#FCFBF9</span>
              <span className="text-[10px] text-ink-soft font-mono">Paper</span>
            </div>
            <div className="p-2.5 rounded-lg border border-line bg-cream text-center">
              <span className="font-bold text-xs text-ink block">#F3EFEA</span>
              <span className="text-[10px] text-ink-soft font-mono">Cream</span>
            </div>
            <div className="p-2.5 rounded-lg border border-line bg-ink text-center text-paper">
              <span className="font-bold text-xs block">#121212</span>
              <span className="text-[10px] text-gray-400 font-mono">Ink Black</span>
            </div>
            <div className="p-2.5 rounded-lg border border-line bg-paper text-center flex flex-col justify-center items-center">
              <span className="inline-block w-4 h-4 rounded-full border border-line bg-cream animate-pulse" />
              <span className="text-[10px] text-ink-soft font-mono mt-0.5">Physics</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="font-mono text-xs font-bold text-ink">
              Aa Bb Gg 123
            </div>
            <div className="flex gap-2">
              <span className="border border-line rounded px-2 py-0.5 text-[10px] font-mono text-ink-soft bg-paper">
                radius-xl
              </span>
              <span className="border border-line rounded px-2 py-0.5 text-[10px] font-mono text-ink-soft bg-paper">
                btn-sweep
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (previewType === 'crypto-vault') {
      return (
        <div className="w-full bg-[#0B0F19] text-white border border-line/60 rounded-xl p-5 select-none font-sans shadow-inner space-y-4">
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono border-b border-gray-800 pb-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Lock size={12} />
              <span>AES-256 ZERO_LEAK</span>
            </span>
            <span className="text-amber-400 font-mono text-[10px]">AUTO-LOCK 30s</span>
          </div>
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-gray-700" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto text-center font-mono text-xs">
            {['7', '2', '9', '4', '8', '1', '5', '3', '0'].map((num, idx) => (
              <div key={idx} className="p-1.5 rounded bg-gray-900 border border-gray-800 text-gray-300 font-semibold">
                {num}
              </div>
            ))}
          </div>
          <div className="text-[10px] text-center text-gray-400 font-mono">
            Scrambled Numeric Keypad (Anti-Smudge)
          </div>
        </div>
      );
    }

    if (previewType === 'transit-flow') {
      return (
        <div className="w-full bg-[#091B2C] text-white border border-line/60 rounded-xl p-5 select-none font-sans shadow-inner space-y-3">
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono border-b border-gray-800 pb-2">
            <span className="text-blue-400 font-bold">RADAR // CAMPUS COMMUTE</span>
            <span className="text-emerald-400 font-mono text-[10px] animate-pulse">● LIVE 1Hz</span>
          </div>
          <div className="bg-[#102A45] p-3 rounded-lg border border-blue-900/60 flex justify-between items-center">
            <div>
              <span className="text-gray-400 text-[10px] block font-mono">SHUTTLE #02</span>
              <span className="font-bold text-sm text-white">Academic Block A</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-mono font-bold text-sm">3 MINS</span>
              <span className="text-gray-400 text-[10px] block">Calculated ETA</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-1">
            <span>Kalman Filter Smoothed</span>
            <span>Offline SQLite Ready</span>
          </div>
        </div>
      );
    }

    if (previewType === 'security-gateway') {
      return (
        <div className="w-full bg-[#111827] text-white border border-line/60 rounded-xl p-5 select-none font-sans shadow-inner space-y-3">
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono border-b border-gray-800 pb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <ShieldCheck size={12} />
              <span>AST HEURISTIC SHIELD</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">0.38ms LATENCY</span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-2 rounded flex justify-between items-center text-[11px]">
              <span className="text-emerald-300">SELECT * FROM users</span>
              <span className="text-emerald-400 font-bold">PASS [SCORE 0]</span>
            </div>
            <div className="bg-rose-950/40 border border-rose-500/30 p-2 rounded flex justify-between items-center text-[11px]">
              <span className="text-rose-300">' UNION SELECT admin --</span>
              <span className="text-rose-400 font-bold">BLOCK [SCORE 98]</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="py-8 space-y-10 animate-fade-in" id="designs-container">
      {/* Header */}
      <div className="border-b border-line pb-6" id="designs-header">
        <div className="flex items-center gap-2 text-ink-soft font-mono text-xs mb-2">
          <span>&gt; design.tokens --system=monocraft</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3" id="designs-title">
          Designs & Systems
        </h1>
        <p className="text-sm sm:text-base text-ink-soft max-w-[65ch] leading-relaxed" id="designs-subtitle">
          Engineered user interfaces, tokenized design systems, and security UX flows. Prioritizing high-contrast typographic hierarchy, sub-pixel precision, and frictionless interaction.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6" id="designs-filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'border-ink bg-ink text-paper font-semibold shadow-xs'
                  : 'border-line text-ink-soft hover:border-ink hover:text-ink bg-paper'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Design Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="designs-grid">
        {filteredDesigns.map((design: DesignProject) => {
          const isExpanded = expandedDesignIds.includes(design.id);

          return (
            <div
              key={design.id}
              className="border border-line hover:border-ink rounded-2xl p-6 bg-paper hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              id={`design-card-${design.id}`}
            >
              <div>
                {/* Top Interactive Preview */}
                <div className="mb-5">
                  {renderInteractivePreview(design.previewType, design.id)}
                </div>

                {/* Metadata Row */}
                <div className="flex justify-between items-start gap-3 flex-wrap mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-ink" id={`design-title-${design.id}`}>
                        {design.title}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-ink-soft block mt-0.5">
                      {design.category} · {design.year}
                    </span>
                  </div>

                  {design.liveUrl && (
                    <a
                      href={design.liveUrl}
                      target={design.liveUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300 ease-out btn-sweep shrink-0"
                      title="View Live Prototype"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-[13px] text-ink-soft leading-relaxed mt-2 mb-4">
                  {design.description}
                </p>

                {/* Core Design Principles Pills */}
                <div className="space-y-2 mb-4">
                  {design.principles.map((pr, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-mono text-ink-soft">
                      <span className="text-ink font-bold select-none">·</span>
                      <div>
                        <span className="font-semibold text-ink">{pr.title}: </span>
                        <span>{pr.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accordion Expand for Deep-Dive Specs */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleExpand(design.id)}
                  className="w-full pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer group/spec"
                >
                  <span className="font-semibold">
                    {isExpanded ? 'Hide Design Specs' : 'View Design Specs & Tokens'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-ink' : 'text-ink-soft group-hover/spec:text-ink'
                    }`}
                  />
                </button>

                <div className={`edu-expand-container ${isExpanded ? 'is-expanded' : ''}`}>
                  <div className="edu-expand-content">
                    <div className="pt-4 space-y-4 font-mono text-xs">
                      {/* Color Palette Tokens */}
                      <div>
                        <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2">
                          Color Token Architecture
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {design.palette.map((color, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 p-2 rounded-lg border border-line bg-cream/30">
                              <span 
                                className="w-4 h-4 rounded-md border border-line/80 shrink-0 shadow-2xs" 
                                style={{ backgroundColor: color.hex }} 
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-ink text-[11px] truncate">{color.name}</span>
                                  <span className="text-[10px] text-ink-soft">{color.hex}</span>
                                </div>
                                <span className="text-[10px] text-ink-soft block truncate">{color.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Typography Specs */}
                      <div>
                        <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2">
                          Typography Rules
                        </h4>
                        <div className="space-y-1.5">
                          {design.typography.map((typo, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 rounded border border-line bg-paper text-[11px]">
                              <span className="font-semibold text-ink">{typo.role}</span>
                              <span className="text-ink-soft">{typo.family} ({typo.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div>
                        <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2">
                          Key Design Highlights
                        </h4>
                        <ul className="space-y-1.5 text-ink-soft text-[11px]">
                          {design.keyHighlights.map((hl, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 size={12} className="shrink-0 text-emerald-600 mt-0.5" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
