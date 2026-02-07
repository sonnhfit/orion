import React, { useState, useRef, useEffect } from 'react';
import {
  IoAdd,
  IoBusinessSharp,
  IoVideocam,
  IoImage,
  IoLink,
  IoClose,
  IoChevronDown
} from 'react-icons/io5';
import '../styles/CreateMenu.css';

interface CreateMenuProps {
  isCollapsed?: boolean;
}

export const CreateMenu: React.FC<CreateMenuProps> = ({ isCollapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Position dropdown to the right of the sidebar button with small gap
      const top = buttonRect.top + window.scrollY + 8; // 8px gap from button
      const left = buttonRect.right + window.scrollX + 12; // 12px gap from sidebar edge
      
      setPosition({ top, left });
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const menuItems = [
    {
      id: 'brand',
      label: 'Thêm thương hiệu mới',
      icon: IoBusinessSharp,
      description: 'Tạo một thương hiệu mới'
    },
    {
      id: 'video',
      label: 'Tạo video mới',
      icon: IoVideocam,
      description: 'Tạo video từ đầu'
    },
    {
      id: 'image',
      label: 'Tạo hình ảnh mới',
      icon: IoImage,
      description: 'Tạo hình ảnh bằng AI'
    },
    {
      id: 'source',
      label: 'Thêm nguồn crawl',
      icon: IoLink,
      description: 'Thêm nguồn dữ liệu mới'
    }
  ];

  const handleMenuItemClick = (id: string) => {
    console.log('Creating:', id);
    // TODO: Implement actual functionality for each menu item
    setIsOpen(false);
  };

  return (
    <div className="create-menu-container" ref={menuRef}>
      <button
        ref={buttonRef}
        className={`create-menu-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isCollapsed ? 'Tạo mới' : ''}
      >
        <IoAdd className="create-menu-icon" />
        {!isCollapsed && (
          <>
            <span className="create-menu-text">Tạo mới</span>
            <IoChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div 
          className={`create-menu-dropdown ${isCollapsed ? 'left-aligned' : ''}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          <div className="create-menu-header">
            <h3>Tạo mới</h3>
            <button
              className="close-dropdown-button"
              onClick={() => setIsOpen(false)}
              title="Đóng"
            >
              <IoClose />
            </button>
          </div>
          <div className="create-menu-items">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className="create-menu-item"
                  onClick={() => handleMenuItemClick(item.id)}
                >
                  <div className="item-icon-wrapper">
                    <IconComponent className="item-icon" />
                  </div>
                  <div className="item-content">
                    <div className="item-label">{item.label}</div>
                    <div className="item-description">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
