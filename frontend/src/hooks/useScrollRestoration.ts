import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

// Store scroll positions for different routes
const scrollPositions: Record<string, ScrollPosition> = {};

export const useScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const currentTime = Date.now();
    
    // Check if this is likely a back navigation (within last 5 seconds)
    const recentPosition = scrollPositions[currentPath];
    const isRecentBackNavigation = recentPosition && (currentTime - recentPosition.timestamp) < 5000;
    
    if (isRecentBackNavigation) {
      // Restore scroll position for back navigation
      const { x, y } = recentPosition;
      setTimeout(() => {
        window.scrollTo(x, y);
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // Scroll to top for new page navigation
      window.scrollTo(0, 0);
    }

    // Clean up old scroll positions (older than 30 seconds)
    Object.keys(scrollPositions).forEach(path => {
      if (currentTime - scrollPositions[path].timestamp > 30000) {
        delete scrollPositions[path];
      }
    });

    // Store current scroll position when leaving the page
    const handleBeforeUnload = () => {
      scrollPositions[currentPath] = {
        x: window.scrollX,
        y: window.scrollY,
        timestamp: currentTime,
      };
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Store scroll position when component unmounts (navigation away)
      scrollPositions[currentPath] = {
        x: window.scrollX,
        y: window.scrollY,
        timestamp: currentTime,
      };
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);

  // Function to manually save scroll position (useful for specific navigation cases)
  const saveScrollPosition = (path?: string) => {
    const currentPath = path || location.pathname + location.search;
    scrollPositions[currentPath] = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };
  };

  return { saveScrollPosition };
};
