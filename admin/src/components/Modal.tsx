import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ open, isOpen, onClose, title, children }: ModalProps) => {
  if (!(open || isOpen)) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] z-10 border border-blue-500/20 flex flex-col overflow-visible">
        <div className="flex items-center justify-between p-5 border-b border-blue-500/20 flex-shrink-0 relative z-0">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-blue-400 transition">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto overscroll-contain flex-1" style={{ overflow: 'visible' }}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
