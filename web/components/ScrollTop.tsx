'use client';

import { useEffect } from 'react';

export default function ScrollTop() {
  useEffect(() => {
    // Prevent browser from restoring previous scroll position on reload
    if (typeof window !== 'undefined' && history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
  return null;
}
