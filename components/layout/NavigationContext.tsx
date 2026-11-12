'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { NavRouteItem } from '@/constants/tokens';

interface NavigationContextValue {
  activePath: string;
  routeNotice: NavRouteItem | null;
  navigate: (item: NavRouteItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
  dismissNotice: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePath, setActivePath] = useState<string>('/');
  const [routeNotice, setRouteNotice] = useState<NavRouteItem | null>(null);

  useEffect(() => {
    const syncPath = () => {
      setActivePath(window.location.pathname || '/');
    };
    const frame = requestAnimationFrame(syncPath);
    window.addEventListener('popstate', syncPath);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', syncPath);
    };
  }, []);

  const navigate = useCallback(
    (item: NavRouteItem, event: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      setActivePath(item.href);

      try {
        window.history.pushState({}, '', item.href);
      } catch {
        // Ignore history pushState restrictions in sandboxed iframes if any
      }

      if (item.href === '/') {
        setRouteNotice(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setRouteNotice(item);

      if (item.sectionAnchor) {
        const targetEl = document.getElementById(item.sectionAnchor);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    []
  );

  const dismissNotice = useCallback(() => {
    setRouteNotice(null);
    setActivePath('/');
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // ignore
    }
  }, []);

  return (
    <NavigationContext.Provider
      value={{ activePath, routeNotice, navigate, dismissNotice }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
}

