import { useState, FormEvent } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, Clock, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ message: string; id?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessResult({
          message: data.message || 'Thank you! Your message has been sent successfully.',
          id: data.id,
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit message. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sapphire-50 border border-sapphire-200 text-sapphire-700 text-xs font-bold mb-4">
          <MessageSquare size={14} className="text-sapphire-600" />
          <span>We Are Here to Help</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">
          Contact Us & Support
        </h1>
        <p className="text-sm text-indigo-900/60 font-medium mt-2 max-w-xl mx-auto">
          Have a question about promo codes, encounter an issue with your reward credits, or want to partner with TrendPulseXhub.com? Send us a direct message below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-indigo-950/10 shadow-sm">
          <h2 className="text-xl font-black text-indigo-950 mb-2">Send an Inline Message</h2>
          <p className="text-xs text-indigo-900/60 font-medium mb-6">
            Fill out the form below. Your message will be securely delivered to our administrative support desk.
          </p>

          {/* Success Banner */}
          {successResult && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <h3 className="font-bold text-sm">Message Delivered!</h3>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {successResult.message}
              </p>
              {successResult.id && (
                <p className="text-[11px] text-emerald-700 font-mono">
                  Ticket Reference ID: <span className="font-bold">{successResult.id}</span>
                </p>
              )}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1.5" htmlFor="contact-name">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-3 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600 focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1.5" htmlFor="contact-email">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-3 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-indigo-950 mb-1.5" htmlFor="contact-subject">
                Subject / Topic <span className="text-rose-500">*</span>
              </label>
              <select
                id="contact-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-3 text-xs font-bold text-indigo-950 focus:outline-none focus:border-sapphire-600 focus:bg-white transition-all cursor-pointer"
              >
                <option value="General Inquiry">General Inquiry & Question</option>
                <option value="Promo Code Fix / Submission">Promo Code Fix or New Code Submission</option>
                <option value="Community Credits / Wallet">Community Credits & Wallet Issue</option>
                <option value="Advertising & Partnerships">Advertising & Business Inquiries</option>
                <option value="DMCA / Copyright Notice">DMCA / Copyright Takedown Request</option>
                <option value="Bug Report">Technical Bug Report</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-indigo-950 mb-1.5" htmlFor="contact-message">
                Message Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={6}
                placeholder="Please describe your question, issue, or code submission with specific details..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-azure-50/60 border border-indigo-950/15 rounded-xl px-4 py-3 text-xs font-medium text-indigo-950 focus:outline-none focus:border-sapphire-600 focus:bg-white transition-all resize-y"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sapphire-700 to-indigo-900 hover:from-sapphire-600 hover:to-indigo-800 text-white px-6 py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-sapphire-600/25 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Message Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info & FAQ (1 Col) */}
        <div className="space-y-6">
          {/* Quick Contact Card */}
          <div className="bg-gradient-to-br from-indigo-950 via-sapphire-950 to-indigo-900 rounded-3xl p-6 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center">
                <Mail size={18} />
              </div>
              <h3 className="font-black text-base">Direct Contact</h3>
            </div>
            <p className="text-xs text-azure-100/70 leading-relaxed">
              Prefer direct email? You can also email our operational staff directly:
            </p>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs font-mono text-sky-200">
              support@trendpulsexhub.com
            </div>
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-azure-100/70">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-sky-400 shrink-0" />
                <span>Typical Response Time: <strong>24-48 Hours</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>SSL Secured & GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Code Submissions Card */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-950/10 shadow-sm space-y-4 text-xs">
            <h3 className="font-black text-sm text-indigo-950 flex items-center gap-2">
              <Sparkles size={16} className="text-sapphire-600" />
              Frequently Asked Topics
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-indigo-950">How often are promo codes updated?</h4>
                <p className="text-indigo-900/70 text-[11px] mt-0.5">
                  Our automated AI scraping engine synchronizes verified working codes every 12 hours from official developer feeds.
                </p>
              </div>

              <div className="pt-2 border-t border-indigo-950/5">
                <h4 className="font-bold text-indigo-950">How do I submit a new code?</h4>
                <p className="text-indigo-900/70 text-[11px] mt-0.5">
                  Select &quot;Promo Code Fix / Submission&quot; in the form above and provide the Game Name, Code, and Reward.
                </p>
              </div>

              <div className="pt-2 border-t border-indigo-950/5">
                <h4 className="font-bold text-indigo-950">Need legal or privacy information?</h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-sapphire-600">
                  <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                  <span>•</span>
                  <Link to="/terms" className="hover:underline">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
