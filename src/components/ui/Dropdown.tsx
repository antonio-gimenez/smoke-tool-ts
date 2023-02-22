import { useState, useRef } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';

interface DropdownProps {
  label: string;
  position?: 'start' | 'center' | 'end' | 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode | string;
  className?: string;
  isMenu?: boolean;
}

const Dropdown = ({ position = 'start', label, isMenu, children, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useOnClickOutside(
    {
      ref: dropdownRef,
      handler: () => setIsOpen(false),
    }
  )

  return (
    <div className={`dropdown ${position} ${className || ''}`} ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {label}
      </button>
      {isOpen && (
        <div className={`dropdown-content ${isMenu ? 'menu' : ''
          }`}>
          <div className="dropdown-menu">{children}</div>
        </div>
      )
      }
    </div >
  );
};

export default Dropdown;
