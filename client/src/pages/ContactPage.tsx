import { Helmet } from 'react-helmet-async';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiArrowRight, FiCheck, FiClock, FiUsers, FiAward, FiShoppingCart, FiHome, FiTool, FiBox, FiMessageCircle, FiLink, FiGlobe } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const subject = encodeURIComponent(formData.get('subject') as string);
    const body = encodeURIComponent(
      `Name: ${formData.get('name')}\nPhone: ${formData.get('phone')}\n\n${formData.get('message')}`
    );
    window.location.href = `mailto:info@pravaraworldtech.com?subject=${subject}&body=${body}`;
    setTimeout(() => setLoading(false), 1000);
  };

  const inquiryTypes = [
    { icon: <FiShoppingCart className="w-8 h-8" />, title: 'Shop & Browse Products' },
    { icon: <FiHome className="w-8 h-8" />, title: 'Project Inquiry' },
    { icon: <FiTool className="w-8 h-8" />, title: 'Service & Support' },
    { icon: <FiBox className="w-8 h-8" />, title: 'Bulk Inquiry' },
    { icon: <FiMessageCircle className="w-8 h-8" />, title: 'General Inquiry' },
    { icon: <FiLink className="w-8 h-8" />, title: 'Partnership Opportunities' },
  ];

  const supportChannels = [
    { icon: <HiOutlinePhone className="w-6 h-6" />, title: 'Phone', contact: '+91 98496 97886', subtext: 'Direct calling support' },
    { icon: <HiOutlineMail className="w-6 h-6" />, title: 'Email', contact: 'info@pravaraworldtech.com', subtext: 'Email support' },
    { icon: <FaWhatsapp className="w-6 h-6" />, title: 'WhatsApp', contact: 'Chat Now', subtext: 'Instant messaging' },
  ];

  const whyChooseUs = [
    { icon: <FiCheck className="w-6 h-6" />, title: 'Quick Response', desc: 'Get replies within 24 hours' },
    { icon: <FiUsers className="w-6 h-6" />, title: 'Expert Team', desc: 'Experienced consultants ready to help' },
    { icon: <FiClock className="w-6 h-6" />, title: '24/7 Support', desc: 'Always available for your needs' },
    { icon: <FiAward className="w-6 h-6" />, title: 'PAN India', desc: 'Support across entire country' },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Pravara World Tech | Pravara World Tech</title>
        <meta name="description" content="Get in touch with Pravara World Tech for any queries, support, or business inquiries." />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-950/30 to-black py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block bg-blue-500/20 border border-blue-500/40 px-4 py-2 rounded-full mb-6">
                <p className="text-sm font-semibold text-blue-400 flex items-center justify-center gap-2"><HiOutlinePhone className="w-4 h-4" /> GET IN TOUCH | PRAVARA WORLD TECH <HiOutlinePhone className="w-4 h-4" /></p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">We're Here to Help</h1>
              <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
                Have questions or need assistance? Our expert team is ready to support you with personalized solutions and expert guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2"><HiOutlinePhone className="w-8 h-8 text-yellow-400" /> Quick Support Channels</h2>
              <p className="text-lg text-gray-400">Choose your preferred way to connect</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportChannels.map((channel, idx) => (
                <a
                  key={idx}
                  href={idx === 0 ? 'tel:+919849697886' : idx === 1 ? 'mailto:info@pravaraworldtech.com' : 'https://wa.me/919849697886'}
                  target={idx === 2 ? '_blank' : undefined}
                  rel={idx === 2 ? 'noopener noreferrer' : undefined}
                  className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8 text-center hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-500/40 rounded-full mb-4 text-blue-400">
                    {channel.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{channel.title}</h3>
                  <p className="text-yellow-400 font-semibold text-lg mb-2">{channel.contact}</p>
                  <p className="text-gray-400 text-sm">{channel.subtext}</p>
                </a>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-6">Also available through other contact numbers</p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <a href="tel:9966167886" className="text-blue-400 hover:text-blue-300 font-semibold">9966167886</a>
                <span className="text-gray-600 hidden sm:inline">|</span>
                <a href="tel:9951114381" className="text-blue-400 hover:text-blue-300 font-semibold">9951114381</a>
                <span className="text-gray-600 hidden sm:inline">|</span>
                <a href="tel:8143550515" className="text-blue-400 hover:text-blue-300 font-semibold">8143550515</a>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Contact Us?</h2>
              <p className="text-lg text-gray-400">Experience our world-class customer service</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-500/40 rounded-full mb-4 text-blue-400">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inquiry Types Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">What Can We Help With?</h2>
              <p className="text-lg text-gray-400">We handle all types of inquiries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiryTypes.map((type, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-2 border-blue-500/40 rounded-xl p-8 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                  <div className="text-5xl mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    {type.icon}
                  </div>
                  <div className="border-t border-blue-500/30 pt-4">
                    <p className="font-bold text-lg text-white">{type.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Send us a Message</h2>
              <p className="text-lg text-gray-400">Fill the form below and we'll get back to you soon</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 bg-blue-900/30 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                    <input type="tel" name="phone" className="w-full px-4 py-3 bg-blue-900/30 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors" placeholder="Your phone number" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Subject</label>
                  <input type="text" name="subject" required className="w-full px-4 py-3 bg-blue-900/30 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors" placeholder="What is this inquiry about?" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                  <textarea name="message" required rows={6} className="w-full px-4 py-3 bg-blue-900/30 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors resize-none" placeholder="Tell us more about your inquiry. Include details like project type, budget, timeline, etc..." />
                </div>
                <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  {!loading && <FiArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Connect Section */}
        <div className="py-20 border-b border-blue-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2"><FiGlobe className="w-8 h-8 text-yellow-400" /> Connect on Social Media</h2>
              <p className="text-lg text-gray-400 mb-12">Follow us for updates, tips, and latest projects</p>

              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  <FaFacebook className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
                <a href="#" className="inline-flex items-center gap-2 px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors">
                  <FaInstagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
                <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                  <FaWhatsapp className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-t from-blue-950/30 to-transparent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're planning a project or just have a question, we're here to help. Reach out to our team today!
            </p>
            <a href="https://wa.me/919849697886" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
              <FaWhatsapp className="w-5 h-5" />
              <span>Start Conversation on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
