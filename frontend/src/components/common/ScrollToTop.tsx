import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Store scroll positions for different routes
const scrollPositions: Record<string, { x: number; y: number; timestamp: number }> = {};

export const ScrollToTop: React.FC = () => {
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
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(x, y);
      });
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

    // Save scroll position when leaving the page
    const handleBeforeUnload = () => {
      scrollPositions[currentPath] = {
        x: window.scrollX,
        y: window.scrollY,
        timestamp: currentTime,
      };
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Save current scroll position
      scrollPositions[currentPath] = {
        x: window.scrollX,
        y: window.scrollY,
        timestamp: currentTime,
      };
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);

  return null;
};

// Utility function to save scroll position before navigation
export const saveScrollPosition = (path: string) => {
  scrollPositions[path] = {
    x: window.scrollX,
    y: window.scrollY,
    timestamp: Date.now(),
  };
};
