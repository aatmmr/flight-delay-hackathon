import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { flightAPI } from '../lib/api';
import { Flight } from '../types';

export function SearchPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<string[]>([]);
  const [carriers, setCarriers] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    carrier: '',
    minDelay: '',
    maxDelay: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [airportsRes, carriersRes] = await Promise.all([
        flightAPI.getAirports(),
        flightAPI.getCarriers(),
      ]);
      setAirports(airportsRes.data.airports);
      setCarriers(carriersRes.data.carriers);
      await loadFlights();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFlights = async () => {
    try {
      setLoading(true);
      const res = await flightAPI.searchFlights(page, 50, {
        origin: filters.origin || undefined,
        destination: filters.destination || undefined,
        carrier: filters.carrier || undefined,
        minDelay: filters.minDelay ? parseInt(filters.minDelay) : undefined,
        maxDelay: filters.maxDelay ? parseInt(filters.maxDelay) : undefined,
      });
      setFlights(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (error) {
      console.error('Failed to search flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadFlights();
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Search Flights</h1>

      <form
        onSubmit={handleSearch}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Origin</label>
            <select
              value={filters.origin}
              onChange={(e) => handleFilterChange('origin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Origins</option>
              {airports.map((airport) => (
                <option key={airport} value={airport}>
                  {airport}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <select
              value={filters.destination}
              onChange={(e) => handleFilterChange('destination', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Destinations</option>
              {airports.map((airport) => (
                <option key={airport} value={airport}>
                  {airport}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Carrier</label>
            <select
              value={filters.carrier}
              onChange={(e) => handleFilterChange('carrier', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Carriers</option>
              {carriers.map((carrier) => (
                <option key={carrier} value={carrier}>
                  {carrier}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Min Delay (min)</label>
            <input
              type="number"
              value={filters.minDelay}
              onChange={(e) => handleFilterChange('minDelay', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Delay (min)</label>
            <input
              type="number"
              value={filters.maxDelay}
              onChange={(e) => handleFilterChange('maxDelay', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && flights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Carrier</th>
                <th className="px-4 py-2 text-left">Origin</th>
                <th className="px-4 py-2 text-left">Destination</th>
                <th className="px-4 py-2 text-right">Dep Delay (min)</th>
                <th className="px-4 py-2 text-right">Arr Delay (min)</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-medium">{flight.carrier}</td>
                  <td className="px-4 py-2">{flight.originAirportName}</td>
                  <td className="px-4 py-2">{flight.destAirportName}</td>
                  <td
                    className={`px-4 py-2 text-right ${
                      flight.depDelay > 15 ? 'text-red-600 font-medium' : ''
                    }`}
                  >
                    {flight.depDelay}
                  </td>
                  <td
                    className={`px-4 py-2 text-right ${
                      flight.arrDelay > 15 ? 'text-red-600 font-medium' : ''
                    }`}
                  >
                    {flight.arrDelay}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-4 flex justify-between items-center bg-gray-50">
            <span className="text-sm text-gray-600">
              Showing {(page - 1) * 50 + 1} to {Math.min(page * 50, total)} of {total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && flights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No flights found. Try adjusting your filters.
        </div>
      )}
    </motion.div>
  );
}
