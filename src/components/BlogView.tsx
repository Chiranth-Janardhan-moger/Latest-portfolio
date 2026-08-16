import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Tag, ArrowUpRight } from 'lucide-react';
import { INITIAL_BLOGS } from '../data';
import { BlogPost } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogView() {
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Fetch dynamic custom posts on mount (if any exist on the server)
  useEffect(() => {
    fetch('/api/blogs/custom')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.posts)) {
          setBlogs([...data.posts, ...INITIAL_BLOGS]);
        }
      })
      .catch(err => console.error("Error loading custom posts:", err));
  }, []);

  return (
    <div className="py-8 space-y-12 animate-fade-in" id="blog-container">
      {!selectedPost ? (
        <div className="space-y-10" id="blog-list-wrapper">
          <div className="border-b border-line/80 pb-6" id="blog-header-section">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3" id="blog-title">
              Writing & Research
            </h1>
            <p className="text-sm sm:text-base text-ink-soft max-w-[62ch] leading-relaxed" id="blog-subtitle">
              Deep dives exploring on-device compilation engines, security heuristic ASTs, telemetry architectures, and distributed systems.
            </p>
          </div>

          {/* Apple-Style Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="blog-grid">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="aquamorphic-card group border border-line/80 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 hover:border-ink hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.1)] cursor-pointer flex flex-col justify-between h-full"
                id={`blog-card-${post.id}`}
              >
                <div id={`blog-card-top-${post.id}`}>
                  <div className="flex justify-between items-center mb-4" id={`blog-card-meta-${post.id}`}>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink bg-neutral-100 border border-neutral-200/80 px-3 py-1 rounded-full shadow-2xs font-semibold" id={`blog-card-cat-${post.id}`}>
                      {post.category}
                    </span>
                    <span className="font-mono text-[11px] text-ink-soft" id={`blog-card-date-${post.id}`}>
                      {post.publishedAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-ink tracking-tight leading-snug mb-2.5 group-hover:text-ink-soft transition-colors" id={`blog-card-title-${post.id}`}>
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-ink-soft line-clamp-3 mb-5 leading-relaxed" id={`blog-card-summary-${post.id}`}>
                    {post.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-line/60" id={`blog-card-tags-${post.id}`}>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(tag => (
                      <span key={tag} className="font-mono text-[10px] text-ink-soft border border-line/80 rounded-full px-2.5 py-0.5 bg-cream/60" id={`blog-card-tag-${post.id}-${tag}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="w-8 h-8 rounded-full border border-line/80 bg-white group-hover:bg-ink group-hover:text-paper flex items-center justify-center text-ink shrink-0 transition-all duration-200 shadow-2xs">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <article className="space-y-8 animate-fade-in" id="full-article-container">
          {/* Apple Back Button */}
          <div className="flex items-center justify-between border-b border-line/80 pb-4" id="article-nav-top">
            <button
              onClick={() => setSelectedPost(null)}
              className="w-9 h-9 rounded-full border border-line/80 bg-white/80 backdrop-blur-md hover:bg-ink hover:text-paper flex items-center justify-center text-ink shadow-2xs hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
              id="btn-back-to-blogs"
              title="Back"
              aria-label="Back to blogs"
            >
              <ChevronLeft size={18} className="text-current transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
            <span className="font-mono text-xs text-ink-soft">
              Blog / <span className="text-ink font-semibold">{selectedPost.category}</span>
            </span>
          </div>

          {/* Article Head */}
          <div className="border-b border-line/80 pb-8" id="article-header">
            <div className="flex items-center gap-3 text-xs text-ink-soft font-mono mb-4" id="article-head-meta">
              <span className="bg-neutral-100 border border-neutral-200/80 px-3 py-1 text-ink rounded-full font-semibold shadow-2xs" id="article-cat">
                {selectedPost.category}
              </span>
              <span className="flex items-center gap-1.5" id="article-date">
                <Calendar size={13} /> {selectedPost.publishedAt}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4" id="article-title">
              {selectedPost.title}
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed" id="article-summary">
              {selectedPost.summary}
            </p>
          </div>

          {/* Article Body */}
          <div className="article-body prose prose-slate max-w-none text-ink-soft leading-relaxed" id="article-content-body">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({node, ...props}) => <div className="overflow-x-auto my-6 border border-line/80 rounded-2xl shadow-xs"><table className="min-w-full border-collapse text-sm" {...props} /></div>,
                thead: ({node, ...props}) => <thead className="bg-[#F7F6F2] border-b border-line/80" {...props} />,
                tbody: ({node, ...props}) => <tbody className="divide-y divide-line/60 bg-white" {...props} />,
                tr: ({node, ...props}) => <tr className="hover:bg-cream/20 transition-colors" {...props} />,
                th: ({node, ...props}) => <th className="px-4 py-3 text-left font-semibold text-ink text-[11px] uppercase tracking-wider border-r border-line/60 last:border-r-0" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-3 text-ink-soft text-xs leading-relaxed border-r border-line/60 last:border-r-0" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-ink mt-10 mb-4 tracking-tight" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-ink mt-8 mb-3 tracking-tight" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-ink mt-6 mb-2 tracking-tight" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-lg font-bold text-ink mt-5 mb-2 tracking-tight" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed text-ink-soft my-4 text-sm sm:text-base" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4 space-y-2 text-ink-soft text-sm sm:text-base" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4 space-y-2 text-ink-soft text-sm sm:text-base" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-3 border-ink pl-4 italic text-ink-soft my-5 bg-cream/30 p-3 rounded-r-xl" {...props} />,
                code: ({node, className, children, ...props}) => {
                  const isInline = !String(children).includes('\n');
                  if (isInline) {
                    return <code className="font-mono text-[11px] bg-cream px-1.5 py-0.5 border border-line/80 rounded-md text-red-600 font-medium" {...props}>{children}</code>;
                  }
                  return (
                    <div className="rounded-2xl border border-line/80 overflow-hidden my-6 bg-[#0B0F17] shadow-md">
                      <div className="bg-[#181E2B] px-4 py-2 flex items-center gap-2 border-b border-gray-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      </div>
                      <pre className="p-4 overflow-x-auto text-gray-200">
                        <code className="font-mono text-xs block whitespace-pre leading-relaxed" {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                },
                img: ({node, src, alt, ...props}) => (
                  <span className="block my-6 text-center">
                    <img 
                      src={src} 
                      alt={alt} 
                      className="mx-auto rounded-2xl border border-line/80 max-w-full max-h-[440px] object-contain shadow-md" 
                      referrerPolicy="no-referrer" 
                      {...props}
                    />
                    {alt && <span className="block text-xs text-ink-soft italic mt-2">{alt}</span>}
                  </span>
                ),
                a: ({node, ...props}) => (
                  <a 
                    className="text-ink font-semibold underline decoration-line hover:decoration-ink underline-offset-2 transition-all hover:text-black" 
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props} 
                  />
                ),
              }}
            >
              {selectedPost.content}
            </Markdown>
          </div>

          {/* Tags footer */}
          <div className="border-t border-line/80 pt-6 flex flex-wrap gap-2 items-center" id="article-footer-tags">
            <span className="font-mono text-xs text-ink-soft flex items-center gap-1" id="lbl-tags">
              <Tag size={12} /> tags:
            </span>
            {selectedPost.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-xs text-ink-soft border border-line/80 rounded-full px-3 py-0.5 bg-white shadow-2xs"
                id={`article-footer-tag-${tag}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}

