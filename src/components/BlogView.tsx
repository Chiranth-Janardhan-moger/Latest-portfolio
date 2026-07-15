import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { INITIAL_BLOGS } from '../data';
import { BlogPost } from '../types';
import Markdown from 'react-markdown';

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
        <div className="space-y-12" id="blog-list-wrapper">
          {/* Header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3" id="blog-title">
              Technical Logs &amp; Insights
            </h1>
            <p className="text-base text-ink-soft max-w-[60ch] leading-relaxed" id="blog-subtitle">
              Rigorous evaluations, lessons learned breaking my own architectures, and explorations in machine learning and systems.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="blog-grid">
            {blogs.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPost(post);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Read technical log: ${post.title}`}
                className="border border-line rounded-xl p-5 bg-paper hover:border-ink hover:-translate-y-1 cursor-pointer flex flex-col justify-between transition-all duration-300 ease-out shadow-2xs focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
                id={`blog-card-${post.id}`}
              >
                <div id={`blog-card-top-${post.id}`}>
                  <div className="flex justify-between items-center mb-3" id={`blog-card-meta-${post.id}`}>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink bg-cream border border-line px-2 py-0.5 rounded-sm" id={`blog-card-cat-${post.id}`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-ink leading-snug mb-2 group-hover:text-ink-soft transition-colors" id={`blog-card-title-${post.id}`}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink-soft line-clamp-3 mb-4 leading-relaxed" id={`blog-card-summary-${post.id}`}>
                    {post.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-line/60" id={`blog-card-tags-${post.id}`}>
                  {post.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] text-ink-soft" id={`blog-card-tag-${post.id}-${tag}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <article className="space-y-8 animate-fade-in" id="full-article-container">
          {/* Back Button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 font-mono text-xs text-ink-soft hover:text-ink transition-colors cursor-pointer"
            id="btn-back-to-blogs"
          >
            <ArrowLeft size={14} />
            back
          </button>

          {/* Article Head */}
          <div className="border-b border-line pb-6" id="article-header">
            <div className="flex items-center gap-3 text-xs text-ink-soft font-mono mb-3" id="article-head-meta">
              <span className="bg-cream border border-line px-2 py-0.5 text-ink rounded-sm font-semibold" id="article-cat">
                {selectedPost.category}
              </span>
              <span className="flex items-center gap-1" id="article-date">
                <Calendar size={12} /> {selectedPost.publishedAt}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight mb-4" id="article-title">
              {selectedPost.title}
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed italic" id="article-summary">
              {selectedPost.summary}
            </p>
          </div>

          {/* Article Body */}
          <div className="article-body prose prose-slate max-w-none text-ink-soft" id="article-content-body">
            <Markdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-ink mt-10 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-ink mt-8 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-ink mt-6 mb-2" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-lg font-bold text-ink mt-5 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed text-ink-soft my-4 text-sm sm:text-base animate-fade-in" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4 space-y-2 text-ink-soft text-sm sm:text-base" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4 space-y-2 text-ink-soft text-sm sm:text-base" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-ink pl-4 italic text-ink-soft my-5" {...props} />,
                code: ({node, className, children, ...props}) => {
                  const isInline = !String(children).includes('\n');
                  if (isInline) {
                    return <code className="font-mono text-[11px] bg-cream px-1.5 py-0.5 border border-line rounded text-red-600 font-medium" {...props}>{children}</code>;
                  }
                  return (
                    <pre className="bg-cream border border-line rounded-lg p-4 my-5 overflow-x-auto text-ink">
                      <code className="font-mono text-xs text-ink-soft block whitespace-pre leading-relaxed" {...props}>{children}</code>
                    </pre>
                  );
                },
                img: ({node, src, alt, ...props}) => (
                  <span className="block my-6 text-center">
                    <img 
                      src={src} 
                      alt={alt} 
                      className="mx-auto rounded-lg border border-line max-w-full max-h-[400px] object-contain shadow-sm" 
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
          <div className="border-t border-line pt-6 flex flex-wrap gap-2 items-center" id="article-footer-tags">
            <span className="font-mono text-xs text-ink-soft flex items-center gap-1" id="lbl-tags">
              <Tag size={12} /> tags:
            </span>
            {selectedPost.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-xs text-ink-soft border border-line rounded-full px-3 py-0.5 bg-cream"
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
