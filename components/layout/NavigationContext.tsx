'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [activePath, setActivePath] = useState<string>(pathname);
  const [routeNotice, setRouteNotice] = useState<NavRouteItem | null>(null);
  const pendingNavRef = useRef<NavRouteItem | null>(null);

  useEffect(() => {
    if (pathname === '/' && pendingNavRef.current) {
      const pending = pendingNavRef.current;
      pendingNavRef.current = null;
      const frame = requestAnimationFrame(() => {
        setActivePath(pending.href);
        setRouteNotice(pending);
        try {
          window.history.replaceState({}, '', pending.href);
        } catch {
          // Ignore history replaceState restrictions if any
        }
        if (pending.sectionAnchor) {
          const targetEl = document.getElementById(pending.sectionAnchor);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => {
      setActivePath(pathname);
      if (pathname !== '/') {
        setRouteNotice(null);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const syncPath = () => {
      setActivePath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', syncPath);
    return () => {
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

      if (item.isPage) {
        pendingNavRef.current = null;
        setRouteNotice(null);
        setActivePath(item.href);
        if (pathname !== item.href) {
          router.push(item.href);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      if (item.href === '/') {
        pendingNavRef.current = null;
        setRouteNotice(null);
        setActivePath('/');
        if (pathname !== '/') {
          router.push('/');
        } else {
          try {
            window.history.pushState({}, '', '/');
          } catch {
            // ignore
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      if (pathname !== '/') {
        pendingNavRef.current = item;
        setRouteNotice(null);
        router.push('/');
        return;
      }

      setActivePath(item.href);

      try {
        window.history.pushState({}, '', item.href);
      } catch {
        // Ignore history pushState restrictions in sandboxed iframes if any
      }

      setRouteNotice(item);

      if (item.sectionAnchor) {
        const targetEl = document.getElementById(item.sectionAnchor);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [pathname, router]
  );

  const dismissNotice = useCallback(() => {
    setRouteNotice(null);
    setActivePath(pathname);
    try {
      window.history.pushState({}, '', pathname);
    } catch {
      // ignore
    }
  }, [pathname]);

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
