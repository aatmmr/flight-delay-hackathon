import { motion } from 'framer-motion';
import { Link } from './Router';

export function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          ✈️ Flight Delay Analysis
        </Link>
        <div className="flex gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Search
          </Link>
          <Link
            to="/analytics"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Analytics
          </Link>
          <Link
            to="/map"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Map
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
