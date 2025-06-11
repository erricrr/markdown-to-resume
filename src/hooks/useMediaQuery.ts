import { useState, useEffect } from 'react';

/**
 * A hook that returns true if the screen matches the given media query
 * @param query CSS media query string e.g. "(max-width: 768px)"
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the match state
  const [matches, setMatches] = useState(() => {
    // Check if window is defined (to avoid issues during SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Return early if window is not defined (for SSR)
    if (typeof window === 'undefined') {
      return undefined;
    }

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Define callback function to handle change
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    // Use the deprecated addListener for older browsers that don't support addEventListener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // @ts-ignore: Older browsers support
      mediaQueryList.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        // @ts-ignore: Older browsers support
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}
