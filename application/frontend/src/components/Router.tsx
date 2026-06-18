import { ReactNode, createContext, useContext, useState } from 'react';

type RouteContextType = {
  currentPath: string;
  navigate: (path: string) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function Router({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState('/');

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  return (
    <RouteContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouter must be used within Router');
  }
  return context;
}

export function Link({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  const { navigate, currentPath } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  const isActive = currentPath === to;

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${className} ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
    >
      {children}
    </a>
  );
}

export function Route({ path, element }: { path: string; element: ReactNode }) {
  const { currentPath } = useRouter();
  return currentPath === path ? <>{element}</> : null;
}
