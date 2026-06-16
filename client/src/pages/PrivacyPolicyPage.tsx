import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const sections = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly: name, email address, phone number, postal address, and any project or service requirements you share when submitting inquiries, booking site visits, registering an account, or placing an order.

We also collect usage data automatically IP address, browser type, pages visited, and time spent through standard server logs and analytics tools. We do not use third-party advertising trackers.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Your information is used to:
• Process and fulfill orders, service requests, and site visit bookings
• Communicate project status, quotations, and support responses
• Verify identity and prevent fraudulent transactions
• Send transactional emails and SMS notifications related to your account
• Improve our platform, services, and product offerings
• Comply with legal obligations

We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '3. Data Sharing',
    body: `We share data only with:
• Trusted service partners (logistics, payment gateways, cloud hosting) bound by data processing agreements
• Authorized employees and freelancers assigned to your project limited to information required to complete the work
• Government or regulatory bodies when legally required

All third-party processors are required to maintain the confidentiality and security of your data.`,
  },
  {
    title: '4. Cookies',
    body: `We use essential cookies for authentication sessions and cart persistence. No marketing or behavioral tracking cookies are set. You may disable cookies in your browser; however, certain features (login, cart) will not function correctly.`,
  },
  {
    title: '5. Data Security',
    body: `We implement industry-standard security measures including HTTPS encryption in transit, hashed password storage (bcrypt), and access controls. No method of transmission over the internet is 100% secure. We encourage you to use strong, unique passwords and notify us immediately of any suspected unauthorized access.`,
  },
  {
    title: '6. Data Retention',
    body: `Account data is retained for the duration of your relationship with us and for up to 5 years after account deletion to meet legal and accounting obligations. You may request deletion of your data at any time by contacting us subject to any legal retention requirements.`,
  },
  {
    title: '7. Your Rights',
    body: `You have the right to:
• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Request deletion of your data
• Withdraw consent for non-essential communications at any time

To exercise any of these rights, email us at info@pravaraworldtech.com.`,
  },
  {
    title: '8. Children\'s Privacy',
    body: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us data, please contact us for immediate removal.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this Privacy Policy periodically. Material changes will be communicated via email or a prominent notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact',
    body: `For privacy-related queries:\nPravara World Tech\nEmail: info@pravaraworldtech.com\nPhone: +91 98496 97886\nAddress: Hyderabad, Telangana, India`,
  },
];

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet><title>Privacy Policy | Pravara World Tech</title></Helmet>

    {/* Hero */}
    <section className="border-b border-yellow-500/20 py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-yellow-400 transition-colors mb-6">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase block mb-3">Legal</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy <span className="text-yellow-400">Policy</span></h1>
        <p className="text-gray-400">Last updated: June 2025</p>
      </div>
    </section>

    {/* Content */}
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 text-base leading-relaxed mb-10 p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          Pravara World Tech ("we", "our", "us") is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use and protect it when you use our website and services.
        </p>

        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-600">
          <Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms & Conditions</Link>
          <Link to="/disclaimer" className="hover:text-yellow-400 transition-colors">Disclaimer</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  </div>
);

export default PrivacyPolicyPage;
