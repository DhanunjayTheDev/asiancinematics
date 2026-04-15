import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface CustomSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: CustomSelectOption[] | Array<{ value: string | number; label?: string }>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  required = false,
  name = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOnTop, setDropdownOnTop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to ensure they have both value and label
  const normalizedOptions: CustomSelectOption[] = options.map((opt: any) => ({
    value: opt.value,
    label: opt.label || opt.value,
    disabled: opt.disabled || false,
  }));

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const dropdownHeight = 250; // approximate height of dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If not enough space below and more space above, position on top
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownOnTop(true);
      } else {
        setDropdownOnTop(false);
      }
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value);
      }
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-black border border-blue-500/20 rounded-lg text-white font-medium
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200
          flex items-center justify-between group
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/40 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
      >
        <span className="text-left text-sm">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:text-blue-400
            ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className={`absolute left-0 right-0 ${dropdownOnTop ? 'bottom-full mb-2' : 'top-full mt-2'} bg-gray-900 
            border border-blue-500/20 rounded-lg shadow-lg z-[9999] overflow-hidden`}
        >
          {/* Search Input */}
          <div className="px-3 py-2 border-b border-blue-500/20">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-1.5 bg-black border border-blue-500/20 rounded text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, idx) => (
                <button
                  key={`${option.value}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={handleKeyDown}
                  disabled={option.disabled}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium transition
                    border-b border-blue-500/10 last:border-b-0
                    ${
                      option.value === value
                        ? 'bg-blue-600/20 text-blue-400 border-l-2 border-l-blue-500'
                        : option.disabled
                          ? 'text-gray-600 cursor-not-allowed opacity-50'
                          : 'text-gray-300 hover:bg-blue-500/10 hover:text-blue-300 cursor-pointer'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {option.value === value && (
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    )}
                    <span>{option.label}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} required={required} />
    </div>
  );
}
