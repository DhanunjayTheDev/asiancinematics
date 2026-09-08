import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const sections = [
  {
    title: '1. Products Covered',
    body: `This policy applies to CCTV Cameras, DVRs, NVRs and surveillance accessories; Home Theatre and Cinema Equipment; AV Receivers, Amplifiers and Speakers; Projectors and Projection Screens; Audio & Video Equipment; Home Automation Products; Security & Access Control Systems; Networking Equipment and Accessories; Cables, Mounts and Installation Accessories; electronic and smart-home products; and other products purchased through PravaraWorld.com.`,
  },
  {
    title: '2. Return Eligibility',
    body: `A product may be considered for return when the product is physically damaged during delivery, the wrong product has been supplied by Pravara World Tech, or the product is found to have a manufacturing defect covered under the applicable manufacturer's warranty.

The customer must inform us within 48 hours of delivery for transit damage, shortage or incorrect product. Clear photographs and/or an unboxing video may be required.`,
  },
  {
    title: '3. Products That Cannot Normally Be Returned',
    body: `Due to the nature of electronic and technical products, the following are generally non-returnable/non-refundable once supplied, opened, activated, installed or configured:
• Customised or special-order products
• Installed CCTV systems
• Installed home theatre/cinema systems
• Projectors after installation or usage
• Speakers after installation
• AV receivers and amplifiers after installation/configuration
• Custom projection screens
• Custom acoustic products and panels
• Cables cut to customer-specific lengths
• Software licences/subscriptions or activation-based products
• Products specially procured for the customer
• Products damaged through misuse, voltage fluctuation, water/moisture, physical damage or unauthorised modification`,
  },
  {
    title: '4. Manufacturing Defects & Warranty',
    body: `Manufacturing defects after delivery will normally be handled under the manufacturer's warranty policy. Pravara World Tech may assist with warranty registration, manufacturer service coordination, inspection/testing, and replacement or repair as approved by the manufacturer.

A manufacturing defect does not automatically qualify the customer for an immediate refund; the final resolution may be repair, replacement or other warranty support according to the manufacturer's terms.`,
  },
  {
    title: '5. Damaged Products During Delivery',
    body: `Customers should inspect the package immediately upon delivery. If damaged, take photographs before opening, record an unboxing video whenever possible, notify Pravara World Tech within 48 hours, and do not install or use the damaged product. Late reporting may affect our ability to process a courier/logistics claim.`,
  },
  {
    title: '6. Wrong Product / Missing Items',
    body: `If an incorrect product or missing item is received, contact us within 48 hours. After verification, Pravara World Tech may arrange replacement, supply of the missing item, or another appropriate resolution.`,
  },
  {
    title: '7. Installation & Service Charges',
    body: `Installation, configuration, site visits, transportation, commissioning and professional service charges are generally non-refundable once the service has been performed. If installation cannot be completed due to site conditions, customer-side delays, lack of required infrastructure, electrical/network limitations or circumstances outside our control, applicable service or visit charges may remain payable.`,
  },
  {
    title: '8. Advance Payments & Order Cancellation',
    body: `Many electronic products are procured specifically after receiving a customer order. Once an order is confirmed and procurement, dispatch, manufacturing, customisation or installation preparation has started, cancellation may not be possible.

If cancellation is accepted before procurement or processing begins, any refund will be considered after applicable payment gateway, bank, procurement, cancellation, transportation/logistics, customisation and other costs are deducted.`,
  },
  {
    title: '9. Customised & Project-Based Orders',
    body: `Products or systems designed specifically for a customer's project may not be eligible for cancellation or refund after confirmation. This includes custom home theatre packages, cinema rooms, acoustic treatment, custom projection screens, custom speaker configurations, CCTV system packages, home automation projects, custom fabrication, special-order equipment, and site-specific installation/integration work. Final measurements and technical requirements may be verified before final installation.`,
  },
  {
    title: '10. Refund Processing',
    body: `Where a refund is approved, it will normally be processed to the original payment method, subject to applicable payment gateway and banking procedures. Approved refunds will generally be initiated within 7–10 business days after approval and completion of the required verification/return process. The bank/payment provider may take additional time to credit the amount.`,
  },
  {
    title: '11. Partial Refunds',
    body: `Where only part of an order is eligible, Pravara World Tech may refund only the eligible product/component after applicable deductions. Installation, service, transportation, customisation and other completed services may not be refundable.`,
  },
  {
    title: '12. Product Inspection',
    body: `Approved returned products may be inspected before refund or replacement is confirmed. Products should be returned with original packaging, invoice, accessories, cables, manuals, warranty documents, original labels/serial numbers and other supplied components. Products showing misuse, physical damage, unauthorised repair, modification or improper installation may be rejected.`,
  },
  {
    title: '13. Refund Exclusions',
    body: `Refunds may not be provided where the issue is caused by customer misuse, accidental/physical damage, water or moisture, electrical surge or voltage fluctuation, incorrect installation, unauthorised modification or repair, customer-caused software/configuration issues, normal wear and tear, compatibility issues where specifications were clearly provided before purchase, or failure to follow manufacturer instructions.`,
  },
  {
    title: '14. Delivery Refusal',
    body: `Customers should not refuse delivery solely because they changed their mind after ordering. For damaged, incorrect or visibly tampered packages, contact Pravara World Tech so the appropriate logistics process can be followed.`,
  },
  {
    title: '15. How to Request a Return or Refund',
    body: `Please provide: Order Number, Customer Name, Registered Mobile Number, Product Name, Reason for Return/Refund, Photos/Videos, and Invoice Copy.

Contact: +91-9849697886 / +91-9966167886 / +91-8143550515
Email: pearlspraveen@gmail.com`,
  },
  {
    title: '16. Policy Changes',
    body: `Pravara World Tech reserves the right to update or modify this Refund & Return Policy. The latest version published on PravaraWorld.com will apply to future orders.`,
  },
  {
    title: '17. Important Notice',
    body: `Nothing in this policy is intended to exclude or restrict any rights or remedies available to customers under applicable Indian law. Where applicable, mandatory consumer protection rights will prevail over any conflicting provision of this policy.`,
  },
];

const RefundPolicyPage = () => (
  <div className="min-h-screen bg-black text-white">
    <Helmet><title>Refund & Return Policy | Pravara World Tech</title></Helmet>

    {/* Hero */}
    <section className="border-b border-yellow-500/20 py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-yellow-400 transition-colors mb-6">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase block mb-3">Legal</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Refund &amp; Return <span className="text-yellow-400">Policy</span></h1>
        <p className="text-gray-400">Effective Date: 07 September 2026</p>
      </div>
    </section>

    {/* Content */}
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-300 text-base leading-relaxed mb-10 p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
          This Refund &amp; Return Policy explains when a product purchased on PravaraWorld.com is eligible for return, replacement or refund, and how installation, customised and project-based orders are handled. Please read it carefully before placing an order.
        </p>

        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-white mb-3">{s.title}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 bg-gray-900 border border-blue-500/20 rounded-xl text-sm text-gray-400">
          <p className="text-white font-semibold mb-2">Contact for Returns & Refunds</p>
          <p>Phone: +91-9849697886 / +91-9966167886 / +91-8143550515</p>
          <p>Email: pearlspraveen@gmail.com</p>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-wrap gap-4 text-xs text-gray-600">
          <Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms & Conditions</Link>
          <Link to="/disclaimer" className="hover:text-yellow-400 transition-colors">Disclaimer</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  </div>
);

export default RefundPolicyPage;
