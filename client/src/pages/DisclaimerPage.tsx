import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const sections = [
  {
    title: '1. General Website Disclaimer',
    body: `All information on this website is provided for general informational and commercial purposes only. While we strive to keep all content accurate and up to date, Asian Cinematics | Pravara World Tech makes no representations or warranties of any kind — express or implied — about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related content on this site.`,
  },
  {
    title: '2. Product Reference Disclaimer',
    body: `Product images shown on the website are for reference purposes only.

• Specifications, models, colours, and designs may change depending on availability and technology upgrades.
• The company is not responsible for third-party product manufacturer changes.
• We recommend confirming final specifications with our sales team before placing any large order.`,
  },
  {
    title: '3. Installation & Site Conditions',
    body: `Installation results may vary depending on site conditions, electrical setup, and structural limitations. Technical advice or system recommendations provided by our team are based on information you supply and general best practices.

Final system performance depends on site-specific conditions including room acoustics, structural characteristics, electrical infrastructure, and environmental factors that may not be fully assessable prior to installation.

Asian Cinematics | Pravara World Tech shall not be held responsible for performance variations arising from conditions not disclosed or not foreseeable at the time of recommendation.`,
  },
  {
    title: '4. Third-Party Products & Brands',
    body: `We are authorized dealers/partners for various third-party brands. All trademarks, product names, and logos belong to their respective owners. Reference to any brand or product does not imply endorsement beyond our authorized dealer relationship.

Third-party manufacturer warranties, terms, and support policies are independent of Asian Cinematics | Pravara World Tech and governed by the respective manufacturer.`,
  },
  {
    title: '5. Cost Estimates & Project Timelines',
    body: `Cost estimates, project timelines, and material quantities provided during consultations or quotations are estimates based on available information at that time. Actual costs may vary due to:

• Site condition discoveries during execution
• Material price fluctuations
• Scope changes requested by the client
• Additional requirements identified during the project

All variations will be communicated and require written approval before proceeding.`,
  },
  {
    title: '6. Delivery Timeline Disclaimer',
    body: `Delivery timelines are approximate and not guaranteed. They depend on product availability, manufacturing lead time, and transport logistics. Remote locations may incur additional charges and longer delivery windows.`,
  },
  {
    title: '7. External Links',
    body: `Our website may contain links to third-party websites for reference or informational purposes. We have no control over the content, privacy policies, or practices of these sites and accept no responsibility for them. Inclusion of any link does not imply endorsement.`,
  },
  {
    title: '8. Website Availability',
    body: `We strive to ensure uninterrupted access to our website and services. However, we do not warrant that the site will be continuously available or free from errors or viruses. We reserve the right to suspend, modify, or discontinue any part of the website or service at any time without prior notice.`,
  },
  {
    title: '9. No Professional Liability',
    body: `Information on this website does not constitute professional engineering, electrical, architectural, or structural advice. For projects involving structural modifications, high-voltage electrical work, or fire safety systems, you must engage licensed professionals in addition to our services.`,
  },
  {
    title: '10. Cash Payment Warning',
    body: `Do NOT make cash payments to any staff member unless officially authorized by the company director. Always use our official payment channels (Bank Transfer, UPI, or Authorized Online Payment) and obtain proper receipts.

If you suspect unauthorized collection, report it immediately to our support team.`,
  },
  {
    title: '11. Limitation of Liability',
    body: `To the fullest extent permitted by applicable law, Asian Cinematics | Pravara World Tech excludes all liability for loss or damage — direct or indirect — arising from:

• Use of this website or reliance on any information provided herein
• Third-party product or service failures
• Delays caused by force majeure events (natural disasters, government restrictions, supply chain disruptions)
• Damage due to improper electrical setup or power fluctuations at the customer site`,
  },
  {
    title: '12. Governing Law',
    body: `This Disclaimer is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana.`,
  },
  {
    title: '13. Contact',
    body: `For questions about this Disclaimer:\nAsian Cinematics | Pravara World Tech\nEmail: info@pravaraworldtech.com\nPhone: +91 98496 97886\nHyderabad, Telangana, India`,
  },
];

const SUPPORT_NUMBERS = ['9849697886', '9966167886', '8143550515', '9951114381'];

const DisclaimerPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet><title>Disclaimer | Asian Cinematics | Pravara World Tech</title></Helmet>

    {/* Hero */}
    <section className="border-b border-yellow-500/20 py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-yellow-400 transition-colors mb-6">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase block mb-3">Legal · Website</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Website <span className="text-yellow-400">Disclaimer</span>
        </h1>
        <p className="text-gray-400 mb-2">Asian Cinematics | Pravara World Tech</p>
        <p className="text-gray-500 text-sm">Last updated: June 2025</p>
      </div>
    </section>

    {/* Support Numbers Banner */}
    <section className="bg-yellow-400/5 border-b border-yellow-400/15 py-4 px-6">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Official Support</span>
        <div className="flex flex-wrap gap-3">
          {SUPPORT_NUMBERS.map(n => (
            <a key={n} href={`tel:+91${n}`} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-yellow-400 transition-colors">
              <FiPhone className="w-3 h-3" /> {n}
            </a>
          ))}
        </div>
        <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors ml-auto">
          <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp Support
        </a>
      </div>
    </section>

    {/* Content */}
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 text-base leading-relaxed mb-10 p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          By using this website or engaging Asian Cinematics | Pravara World Tech for any product or service, you acknowledge that you have read, understood, and agree to this Disclaimer.
        </p>

        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title} className="border-b border-gray-900 pb-10 last:border-0">
              <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-600">
          <Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms & Conditions</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  </div>
);

export default DisclaimerPage;
