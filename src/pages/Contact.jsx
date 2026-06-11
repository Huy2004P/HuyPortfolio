import { useState } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus('');
    try {
      await api.post('/contact', formData);
      setStatus(t('msg_contact_success', 'Message sent successfully!'));
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus(t('msg_contact_error', 'Failed to send. Please try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-display font-semibold tracking-tight">{t('contact_title', 'Get in touch')}</h1>
        <p className="text-lg text-apple-grayNeutral">{t('contact_subtitle', "Have a project in mind or just want to say hi? I'd love to hear from you.")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-apple-graphiteA p-5 sm:p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-sm">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">{t('lbl_name', 'Name')}</label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent focus:outline-none focus:ring-2 focus:ring-apple-blueAction transition-shadow"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">{t('lbl_email', 'Email')}</label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent focus:outline-none focus:ring-2 focus:ring-apple-blueAction transition-shadow"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium">{t('lbl_subject', 'Subject')}</label>
          <input
            type="text"
            id="subject"
            required
            className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent focus:outline-none focus:ring-2 focus:ring-apple-blueAction transition-shadow"
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">{t('lbl_message', 'Message')}</label>
          <textarea
            id="message"
            rows={5}
            required
            className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent focus:outline-none focus:ring-2 focus:ring-apple-blueAction transition-shadow resize-none"
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="w-full bg-apple-ink dark:bg-apple-white text-apple-white dark:text-apple-ink py-3 rounded-full font-medium hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {sending ? t('lbl_sending', 'Sending...') : t('btn_send_message', 'Send Message')}
        </button>
        {status && <p className={`text-center text-sm font-medium ${status.includes('success') || status.includes('thành công') ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
