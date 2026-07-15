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
      {/* Centered minimalist heading */}
      <div className="space-y-4 text-center pb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink min-h-[2.5rem] sm:min-h-[3.25rem]" id="contact-heading">
          Get in Touch
        </h1>
        <p className="text-sm text-ink-medium max-w-[50ch] mx-auto leading-relaxed" id="contact-subheading">
          Have an opportunity, a question, or a project to discuss? Drop a message below and I will get back to you.
        </p>
      </div>

      <div className="space-y-8" id="contact-content">
        {/* Direct Email Card */}
        <div className="flex items-center justify-between gap-4 p-4 border border-line rounded-lg bg-cream/40" id="card-direct-email">
          <div className="flex items-center gap-2.5 text-xs font-mono" id="direct-email-label">
            <Mail size={14} className="text-ink-soft" />
            <span className="text-ink-soft">Email:</span>
            <a 
              href="mailto:chiranthmoger7@gmail.com" 
              className="text-ink font-bold hover:underline transition-colors break-all"
              id="link-direct-email"
            >
              chiranthmoger7@gmail.com
            </a>
          </div>
          <button
            onClick={() => copyToClipboard('chiranthmoger7@gmail.com')}
            className="inline-flex items-center justify-center p-2 rounded border border-line bg-paper hover:bg-ink hover:text-paper hover:border-ink transition-all cursor-pointer btn-sweep"
            id="btn-copy-email"
            title={copiedEmail ? "Copied!" : "Copy Email"}
          >
            {copiedEmail ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>

        {/* Clean Contact Form */}
        <div className="border border-line rounded-xl p-6 sm:p-8 bg-paper shadow-2xs" id="form-console">
          {!submitSuccess ? (
            <form
              onSubmit={handleContactSubmit}
              className="space-y-5 text-sm animate-fade-in"
              id="contact-form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-top-row">
                <div id="grp-name">
                  <label className="block font-mono text-[10px] text-ink uppercase tracking-wider mb-1.5" id="lbl-form-name">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full border border-line rounded-sm bg-paper p-3 text-ink focus:outline-none focus:border-ink transition-colors text-xs"
                    id="input-name"
                  />
                </div>
                <div id="grp-email">
                  <label className="block font-mono text-[10px] text-ink uppercase tracking-wider mb-1.5" id="lbl-form-email">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full border border-line rounded-sm bg-paper p-3 text-ink focus:outline-none focus:border-ink transition-colors text-xs"
                    id="input-email"
                  />
                </div>
              </div>

              <div id="grp-subject">
                <label className="block font-mono text-[10px] text-ink uppercase tracking-wider mb-1.5" id="lbl-form-subject">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-line rounded-sm bg-paper p-3 text-ink focus:outline-none focus:border-ink transition-colors text-xs"
                  id="input-subject"
                />
              </div>

              <div id="grp-message">
                <label className="block font-mono text-[10px] text-ink uppercase tracking-wider mb-1.5" id="lbl-form-message">Message</label>
                <textarea
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full border border-line rounded-sm bg-paper p-3 text-ink focus:outline-none focus:border-ink transition-colors text-xs resize-none"
                  id="input-message"
                />
              </div>

              {submitError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-mono py-1" id="form-error-box">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex justify-end pt-1" id="form-actions-row">
                <button
                  type="submit"
                  disabled={isSubmitting || !name || !email || !message}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 font-mono text-xs border border-ink bg-ink text-white/80 rounded-sm px-6 py-3 hover:bg-ink-soft transition-colors duration-300 ease-out disabled:bg-ink disabled:text-white/50 disabled:border-ink disabled:cursor-not-allowed cursor-pointer shadow-sm btn-sweep"
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
              className="py-8 text-center space-y-4 animate-fade-in"
              id="form-success-console"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cream border border-line text-ink mb-2" id="success-icon-badge">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-base font-bold text-ink" id="success-headline">Message Sent</h3>
              <p className="text-xs text-ink-soft max-w-[38ch] mx-auto leading-relaxed" id="success-copy">
                Thank you! Your message has been sent successfully. Chiranth will get in touch with you soon.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="font-mono text-2xs uppercase font-bold tracking-wider border border-line hover:border-ink hover:bg-ink hover:text-paper hover:border-ink rounded-sm px-4 py-2 bg-paper transition-colors duration-300 ease-out cursor-pointer btn-sweep"
                id="btn-submit-another"
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
