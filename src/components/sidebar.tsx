import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import the useLocation hook
import './Sidebar.css';

import type { ReactNode } from 'react';

const Sidebar = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [hideButton, setHideButton] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get the current location object
  const location = useLocation();

  // The minimum distance required to register a swipe
  const minSwipeDistance = 0;

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to hide the sidebar button based on the URL
  const checkRouteAndHideButton = useCallback(() => {
    // Define the media query for mobile devices.
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Only run the logic if the device is mobile
    if (isMobile) {
      const isNotesPage = location.pathname.includes('/notes');
      
      setHideButton(isNotesPage);
      
      if (isNotesPage) {
        setIsOpen(false);
      }
    } else {
      // Ensure button is visible on desktop
      setHideButton(false);
    }
  }, [location.pathname]); // The function is dependent on the pathname

  // Run the check when the component mounts and when the URL pathname changes
  useEffect(() => {
    checkRouteAndHideButton();
  }, [location.pathname, checkRouteAndHideButton]); // Re-run effect when pathname or function changes

  // Add event listener for window resizing
  useEffect(() => {
    window.addEventListener('resize', checkRouteAndHideButton);
    return () => {
      window.removeEventListener('resize', checkRouteAndHideButton);
    };
  }, [checkRouteAndHideButton]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe right to open (touch started left and moved right)
    if (isRightSwipe && !isOpen) {
      openSidebar();
    }
    
    // Swipe left to close (touch started right and moved left)
    if (isLeftSwipe && isOpen) {
      closeSidebar();
    }
  }, [touchStart, touchEnd, isOpen]);

  useEffect(() => {
    const onDocumentTouchStart = (e: TouchEvent) => {
      if (e.touches[0].clientX < 50 && !isOpen) {
        setTouchEnd(null);
        setTouchStart(e.touches[0].clientX);
      }
    };

    const onDocumentTouchMove = (e: TouchEvent) => {
      if (touchStart !== null) {
        setTouchEnd(e.touches[0].clientX);
      }
    };

    const onDocumentTouchEnd = () => {
      onTouchEnd();
      setTouchStart(null);
      setTouchEnd(null);
    };

    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('touchend', onDocumentTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onDocumentTouchStart);
      document.removeEventListener('touchmove', onDocumentTouchMove);
      document.removeEventListener('touchend', onDocumentTouchEnd);
    };
  }, [touchStart, isOpen, onTouchEnd]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        onMouseEnter={openSidebar}
        onMouseLeave={closeSidebar}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!hideButton && (
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? 'Close' : 'Open'}
          </button>
        )}
        <nav className="menu-container">
          {children}
        </nav>
      </div>
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;
