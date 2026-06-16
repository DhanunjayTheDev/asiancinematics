import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const sections = [
  {
    title: '1. Disclaimer Policy',
    body: `All products, services, designs, and installations provided by Asian Cinematics | Pravara World Tech are based on customer requirements and site feasibility.

• Product images shown on the website are for reference purposes only.
• Specifications, models, and designs may change depending on availability and technology upgrades.
• The company is not responsible for third-party product manufacturer changes.
• Installation results may vary depending on site conditions, electrical setup, and structural limitations.`,
  },
  {
    title: '2. Payment Policy',
    body: `To confirm any order, the following payment terms apply:

Advance Payment: Required to confirm product booking or service scheduling.
Balance Payment: Must be cleared before dispatch / installation completion.

Accepted Payment Methods:
• Bank Transfer (NEFT / RTGS / IMPS)
• UPI / QR Payments
• Authorized Online Payment

Important: Do NOT make cash payments to any staff member unless officially authorized by the company director.`,
  },
  {
    title: '3. Token Registration Policy',
    body: `To start any project or order:

• Customers must pay a Token / Booking Amount.
• Token confirms order registration and scheduling.
• Token amount is non-refundable once materials are ordered or production begins.`,
  },
  {
    title: '4. Non-Return Policy',
    body: `Due to the nature of customized electronics, AV systems, and home theater setups:

• No return or exchange is allowed once products are delivered and installed.
• Special-order products cannot be cancelled or returned.
• Returns will only be considered if the product is dead on arrival (DOA) and verified by our technical team.`,
  },
  {
    title: '5. Return / Replacement Policy',
    body: `Returns are accepted only if:

• Product is damaged during transport
• Product is not matching the order specification
• Product is manufacturer defective

Customer must inform the company within 24 hours of delivery.`,
  },
  {
    title: '6. Damage Policy',
    body: `If any product arrives damaged:

1. Do NOT open the package fully.
2. Immediately record a video of the unopened package.
3. Contact our support team immediately.

Send proof via WhatsApp to our support numbers:
9849697886 | 9966167886 | 8143550515 | 9951114381

Without proper proof, damage claims may not be accepted.`,
  },
  {
    title: '7. Delivery & Freight Policy',
    body: `Delivery timelines depend on:

• Product availability
• Manufacturing lead time
• Transport logistics

Freight conditions:
• Freight charges may be extra unless mentioned in quotation.
• Remote locations may incur additional delivery charges.
• Delivery timelines are approximate and not guaranteed.`,
  },
  {
    title: '8. Packing & Forwarding Policy',
    body: `All products are packed carefully before dispatch.

Packing includes:
• Protective foam packing
• Shock-resistant packaging
• Labelled product identification

Packing & forwarding charges may apply depending on product size.`,
  },
  {
    title: '9. Package Opening Policy (Mandatory Video)',
    body: `For safety and dispute prevention, customers must record a full video while opening the package.

The video must clearly show:
• Package condition
• Seal opening
• Product condition

Failure to record video may result in rejection of damage claims.`,
  },
  {
    title: '10. Receiving Time Verification',
    body: `At the time of delivery, customers should:

✔ Record video while receiving package
✔ Take photos of outer box condition
✔ Verify package seal condition

This helps resolve issues quickly and smoothly.`,
  },
  {
    title: '11. Video Call Verification (If Required)',
    body: `In some cases our support team may request a Live Video Call during box opening. This helps confirm product condition and prevents disputes.`,
  },
  {
    title: '12. Security Policy',
    body: `For security and transparency:

• Time-stamp videos and photos are mandatory for complaints.
• Proof must be shared through WhatsApp or Email.
• Company records will be used for verification.`,
  },
  {
    title: '13. Service Ticket Registration',
    body: `For service or technical issues, customers must register a service ticket.

Provide:
• Order number
• Product model
• Issue description
• Video or photos

This helps our team provide fast and accurate support.`,
  },
  {
    title: '14. Power Failure & Installation Terms',
    body: `During installation:

• Customer must provide stable power supply.
• Power fluctuations may damage equipment.
• The company is not responsible for damage due to improper electrical setup.

UPS / Power protection is strongly recommended.`,
  },
  {
    title: '15. Technical Support Policy',
    body: `For any support request:

• Send details through WhatsApp first
• Then confirm through phone call

This helps our support team respond quickly and accurately.`,
  },
  {
    title: '16. Communication & Intimation Policy',
    body: `Customers must inform the company immediately if:

• Delivery issue occurs
• Installation problem occurs
• Product malfunction occurs

Early communication helps us resolve problems quickly and free of complications.`,
  },
  {
    title: '17. Customer Cooperation Policy',
    body: `For faster resolution, customers should provide:

• Video proof
• Photos
• Time-stamp records

These help our technical team investigate and resolve the issue smoothly.

Customer Cooperation + Proper Documentation = Faster Problem Resolution`,
  },
];

const SUPPORT_NUMBERS = ['9849697886', '9966167886', '8143550515', '9951114381'];

const TermsPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet><title>Terms & Conditions | Asian Cinematics | Pravara World Tech</title></Helmet>

    {/* Hero */}
    <section className="border-b border-yellow-500/20 py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-yellow-400 transition-colors mb-6">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase block mb-3">Legal · Policies</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Website Policies &amp; <span className="text-yellow-400">Terms &amp; Conditions</span>
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
          <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp Support Available
        </a>
      </div>
    </section>

    {/* Content */}
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 text-base leading-relaxed mb-10 p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          Please read these policies carefully before placing any order or engaging our services. By using our website or confirming any booking with Asian Cinematics | Pravara World Tech, you agree to all terms listed below.
        </p>

        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title} className="border-b border-gray-900 pb-10 last:border-0">
              <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        {/* Support Footer */}
        <div className="mt-14 p-6 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          <p className="text-sm font-bold text-yellow-400 mb-3">Official Support — Asian Cinematics | Pravara World Tech</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {SUPPORT_NUMBERS.map(n => (
              <a key={n} href={`tel:+91${n}`} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors">
                <FiPhone className="w-3.5 h-3.5 shrink-0" /> {n}
              </a>
            ))}
          </div>
          <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors">
            <FaWhatsapp className="w-4 h-4" /> WhatsApp Support Available
          </a>
          <p className="text-xs text-gray-600 mt-4">
            Professional AV | Home Theater | CCTV | Automation Solutions — Team Asian | Pravara
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-600">
          <Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
          <Link to="/disclaimer" className="hover:text-yellow-400 transition-colors">Disclaimer</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  </div>
);

export default TermsPage;
