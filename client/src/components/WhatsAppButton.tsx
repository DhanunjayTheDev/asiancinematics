import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919849697886"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/40 hover:shadow-xl hover:shadow-green-500/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <FaWhatsapp className="w-6 h-6" />
  </a>
);

export default WhatsAppButton;
