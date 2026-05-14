import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiZap } from 'react-icons/fi';
import QuickRequestModal from './QuickRequestModal';

const WhatsAppButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Quick Request button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-lg shadow-blue-600/40 hover:shadow-xl hover:shadow-blue-600/60 transition-all duration-300 hover:scale-105"
          aria-label="Quick Request"
        >
          <FiZap className="w-4 h-4" />
          Quick Services
        </button>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/919849697886"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/40 hover:shadow-xl hover:shadow-green-500/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
      </div>

      <QuickRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default WhatsAppButton;
