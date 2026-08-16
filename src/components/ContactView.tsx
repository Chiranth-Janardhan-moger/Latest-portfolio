import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw, Mail, Copy, Check } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Transmission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Clipboard copy
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          access_key: "7d6c16b3-7cc0-4cbe-846f-1b79954fc702",
          name, 
          email, 
          subject: subject || "Contact Form Submission", 
          message 
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Submission failed.");
      }

      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="py-12 max-w-2xl mx-auto px-4 animate-fade-in" id="contact-container">
      {/* Centered Apple-Style Heading */}
      <div className="space-y-3.5 text-center pb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink min-h-[2.5rem] sm:min-h-[3.25rem]" id="contact-heading">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-[15px] text-ink-soft max-w-[50ch] mx-auto leading-relaxed" id="contact-subheading">
          Have an engineering opportunity, a question, or a project to discuss? Drop a message below and I will get back to you.
        </p>
      </div>

      <div className="space-y-6" id="contact-content">
        {/* Direct Email Card (Apple Glass Badge) */}
        <div className="flex items-center justify-between gap-4 p-4 sm:p-5 border border-line/80 rounded-2xl bg-white/80 backdrop-blur-md shadow-[0_2px_12px_-3px_rgba(0,0,0,0.03)]" id="card-direct-email">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono min-w-0" id="direct-email-label">
            <div className="w-8 h-8 rounded-full bg-cream border border-line/80 flex items-center justify-center shrink-0 shadow-2xs">
              <Mail size={14} className="text-ink" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-ink-soft uppercase tracking-wider block font-semibold">Direct Email</span>
              <a 
                href="mailto:chiranthmoger7@gmail.com" 
                className="text-ink font-bold hover:underline transition-colors break-all"
                id="link-direct-email"
              >
                chiranthmoger7@gmail.com
              </a>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard('chiranthmoger7@gmail.com')}
            className="group/copy w-9 h-9 rounded-full border border-line/80 bg-white hover:bg-ink hover:text-white hover:border-ink transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer"
            id="btn-copy-email"
            title={copiedEmail ? "Copied!" : "Copy Email"}
            aria-label="Copy Email"
          >
            {copiedEmail ? (
              <Check size={14} className="text-emerald-600 group-hover/copy:text-emerald-400 transition-colors" />
            ) : (
              <Copy size={14} className="text-ink group-hover/copy:text-white transition-colors" />
            )}
          </button>
        </div>

        {/* Apple Frosted Glass Contact Form */}
        <div className="border border-line/80 rounded-3xl p-6 sm:p-9 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]" id="form-console">
          {!submitSuccess ? (
            <form
              onSubmit={handleContactSubmit}
              className="space-y-5 text-sm animate-fade-in"
              id="contact-form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-top-row">
                <div id="grp-name">
                  <label className="block font-mono text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-2" id="lbl-form-name">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full border border-line/80 rounded-xl bg-[#FAFAFA] p-3.5 text-ink placeholder:text-ink-soft/60 focus:bg-white focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition-all text-xs sm:text-sm shadow-inner"
                    id="input-name"
                  />
                </div>
                <div id="grp-email">
                  <label className="block font-mono text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-2" id="lbl-form-email">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full border border-line/80 rounded-xl bg-[#FAFAFA] p-3.5 text-ink placeholder:text-ink-soft/60 focus:bg-white focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition-all text-xs sm:text-sm shadow-inner"
                    id="input-email"
                  />
                </div>
              </div>

              <div id="grp-subject">
                <label className="block font-mono text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-2" id="lbl-form-subject">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-line/80 rounded-xl bg-[#FAFAFA] p-3.5 text-ink placeholder:text-ink-soft/60 focus:bg-white focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition-all text-xs sm:text-sm shadow-inner"
                  id="input-subject"
                />
              </div>

              <div id="grp-message">
                <label className="block font-mono text-[11px] font-semibold text-ink-soft uppercase tracking-wider mb-2" id="lbl-form-message">Message</label>
                <textarea
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full border border-line/80 rounded-xl bg-[#FAFAFA] p-3.5 text-ink placeholder:text-ink-soft/60 focus:bg-white focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10 transition-all text-xs sm:text-sm resize-none shadow-inner leading-relaxed"
                  id="input-message"
                />
              </div>

              {submitError && (
                <div className="flex items-center gap-2 text-xs text-red-600 font-mono py-1" id="form-error-box">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex justify-end pt-2" id="form-actions-row">
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !message}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 font-mono text-xs font-semibold bg-ink text-paper rounded-full px-7 py-3.5 hover:bg-neutral-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] active:scale-95 transition-all duration-200 cursor-pointer disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed btn-sweep"
                  id="btn-form-submit"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div
              className="py-10 text-center space-y-4 animate-fade-in"
              id="form-success-console"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mb-2 shadow-xs" id="success-icon-badge">
                <CheckCircle2 size={26} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-ink" id="success-headline">Message Sent</h2>
              <p className="text-xs sm:text-sm text-ink-soft max-w-[38ch] mx-auto leading-relaxed" id="success-copy">
                Thank you! Your message has been transmitted successfully. Chiranth will get in touch with you soon.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="font-mono text-xs font-semibold border border-line/80 hover:border-ink hover:bg-ink hover:text-paper rounded-full px-5 py-2.5 bg-white transition-all duration-200 shadow-2xs cursor-pointer active:scale-95"
                  id="btn-submit-another"
                >
                  Send another message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

