import { Helmet } from 'react-helmet-async';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Asian Cinematics</title>
        <meta name="description" content="Get in touch with Asian Cinematics for any queries, support, or business inquiries." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Have questions or need assistance? Reach out to us through any of the channels below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center p-8">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlinePhone className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
            <a href="tel:+919876543210" className="text-primary-600 hover:underline">+91 98765 43210</a>
          </div>
          <div className="card text-center p-8">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineMail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <a href="mailto:info@asiancinematics.com" className="text-primary-600 hover:underline">info@asiancinematics.com</a>
          </div>
          <div className="card text-center p-8">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineLocationMarker className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
            <p className="text-gray-600 text-sm">123 Cinema Street, Film Nagar, Hyderabad, TS 500096</p>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const subject = encodeURIComponent(formData.get('subject') as string);
              const body = encodeURIComponent(
                `Name: ${formData.get('name')}\nPhone: ${formData.get('phone')}\n\n${formData.get('message')}`
              );
              window.location.href = `mailto:info@asiancinematics.com?subject=${subject}&body=${body}`;
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" name="subject" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" required rows={4} className="input-field" />
            </div>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
