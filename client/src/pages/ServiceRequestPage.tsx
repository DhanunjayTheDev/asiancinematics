import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

gsap.registerPlugin(ScrollTrigger);

const ServiceRequestPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    product: '',
    name: '',
    location: '',
    timeline: '',
    reference: '',
    brand: '',
    budget: '',
    roomSize: '',
    length: '',
    width: '',
    height: '',
    dedicatedHT: '',
    livingRoomHT: '',
    towers: '',
    inwalls: '',
    inceilings: '',
    onwalls: '',
    needAtmos: '',
    setupType: '',
    projector: '',
    tv: '',
    preferredBrands: '',
    targetBudget: '',
    duration: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/service-request');
      return;
    }

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      if (formRef.current) {
        gsap.from(formRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.1,
          ease: 'power3.out',
        });
      }

      gsap.utils.toArray('.form-section-animate').forEach((section: any) => {
        gsap.from(section, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            scrub: false,
          },
          ease: 'power3.out',
        });
      });
    });

    return () => ctx.revert();
  }, [isAuthenticated, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.product || !formData.name || !formData.location) {
      return toast.error('Product, Name, and Location are required');
    }

    setLoading(true);
    try {
      await api.post('/service-requests', formData);
      toast.success('Service request submitted successfully!');
      setFormData({
        product: '',
        name: '',
        location: '',
        timeline: '',
        reference: '',
        brand: '',
        budget: '',
        roomSize: '',
        length: '',
        width: '',
        height: '',
        dedicatedHT: '',
        livingRoomHT: '',
        towers: '',
        inwalls: '',
        inceilings: '',
        onwalls: '',
        needAtmos: '',
        setupType: '',
        projector: '',
        tv: '',
        preferredBrands: '',
        targetBudget: '',
        duration: '',
      });
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit service request');
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ label, name, options, required = false }: any) => (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        {label} {required && <span className="text-yellow-400">*</span>}
      </label>
      <select
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  const InputField = ({ label, name, type = 'text', placeholder, required = false }: any) => (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">
        {label} {required && <span className="text-yellow-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={handleChange}
        className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
      />
    </div>
  );

  return (
    <>
      <Helmet><title>Service Request | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={headerRef}>
            <h1 className="text-3xl font-bold text-white mb-2">Service Request Form</h1>
            <p className="text-gray-400 mb-8">
              Tell us about your requirements and our team will get back to you with customized solutions.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info Section */}
            <div className="form-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Product / Service Name" name="product" placeholder="e.g., Home Theatre, Structural Works" required />
                <InputField label="Your Name" name="name" placeholder="Enter your full name" required />
                <InputField label="Location" name="location" placeholder="Enter your location" required />
                <InputField label="Planned Timeline" name="timeline" placeholder="e.g., 2-3 months" />
                <InputField label="Reference Image / Photo" name="reference" placeholder="URL or description" />
                <InputField label="Preferred Brand" name="brand" placeholder="e.g., Sony, Yamaha" />
                <InputField label="Budget" name="budget" placeholder="Estimated budget" />
              </div>
            </div>

            {/* Room Details Section */}
            <div className="form-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Room Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Room Size (Sq Ft)" name="roomSize" placeholder="e.g., 200" type="number" />
                <InputField label="Length" name="length" placeholder="e.g., 20" type="number" />
                <InputField label="Width" name="width" placeholder="e.g., 10" type="number" />
                <InputField label="Height" name="height" placeholder="e.g., 10" type="number" />
                <SelectField label="Dedicated Home Theatre" name="dedicatedHT" options={['Yes', 'No']} />
                <SelectField label="Living Room Home Theatre" name="livingRoomHT" options={['Yes', 'No']} />
              </div>
            </div>

            {/* Speaker Preferences Section */}
            <div className="form-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Speaker Preferences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Towers" name="towers" options={['Yes', 'No']} />
                <SelectField label="Inwalls" name="inwalls" options={['Yes', 'No']} />
                <SelectField label="InCeilings" name="inceilings" options={['Yes', 'No']} />
                <SelectField label="OnWalls" name="onwalls" options={['Yes', 'No']} />
                <SelectField label="Need Atmos" name="needAtmos" options={['Yes', 'No']} />
              </div>
            </div>

            {/* Setup Type Section */}
            <div className="form-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Setup Type for Home Theatre</h2>
              <SelectField
                label="Select Setup"
                name="setupType"
                options={['5.1', '5.1.2 (Atmos)', '7.1', '7.1.2 (Atmos)', '7.2.4 (Atmos)', '9.1', '9.1.2 (Atmos)', '9.2.4 (Atmos)']}
              />
            </div>

            {/* Display/Video Section */}
            <div className="form-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Display / Video</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Projector & Screen" name="projector" options={['Yes', 'No']} />
                <SelectField label="TV" name="tv" options={['Yes', 'No']} />
              </div>
            </div>

            {/* Other Details Section */}
            <div className="form-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Additional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Preferred Brands" name="preferredBrands" placeholder="Comma separated brands" />
                <InputField label="Target Budget" name="targetBudget" placeholder="Budget range" />
                <InputField label="Time Duration to Purchase" name="duration" placeholder="e.g., 1-2 months" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 text-black font-bold py-4 rounded-lg transition text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loading />
                  Submitting...
                </span>
              ) : (
                'Submit Service Request'
              )}
            </button>
          </form>

          <div className="mt-12 p-6 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <p className="text-gray-400 text-sm">
              <span className="font-semibold text-white">📞 Need Help?</span> Contact us at{' '}
              <span className="text-yellow-400 font-medium">98496 97886 | 81435 50515</span>
              {' '}or reach out via{' '}
              <a href="https://wa.me/918143550515" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceRequestPage;
