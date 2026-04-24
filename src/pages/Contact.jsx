import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending
    setStatus('Sending...');
    setTimeout(() => {
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-display font-semibold tracking-tight">Get in touch</h1>
        <p className="text-lg text-apple-grayNeutral">Have a project in mind or just want to say hi? I'd love to hear from you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-apple-graphiteA p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-sm">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
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
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
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
          <label htmlFor="message" className="block text-sm font-medium">Message</label>
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
          className="w-full bg-apple-ink dark:bg-apple-white text-apple-white dark:text-apple-ink py-3 rounded-full font-medium hover:scale-[1.02] transition-transform"
        >
          Send Message
        </button>
        {status && <p className="text-center text-sm font-medium text-apple-blueAction">{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
