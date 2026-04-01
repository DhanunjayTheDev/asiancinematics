import { FiMessageCircle } from 'react-icons/fi';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <FiMessageCircle className="w-6 h-6" />
  </a>
);

export default WhatsAppButton;
