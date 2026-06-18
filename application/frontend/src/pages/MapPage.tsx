import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { analyticsAPI } from '../lib/api';
import { RouteStats, AirportInfo } from '../types';

export function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [routes, setRoutes] = useState<RouteStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [routesRes, airportsRes] = await Promise.all([
        analyticsAPI.getRouteStats(500),
        analyticsAPI.getAirportInfo(),
      ]);

      const routesList = routesRes.data.routes;
      setRoutes(routesList);

      if (mapContainer.current && !map.current) {
        initMap(routesList, airportsRes.data.airports);
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initMap = (routesList: RouteStats[], airportsList: AirportInfo[]) => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current).setView([39.8283, -98.5795], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    drawRoutes(routesList, airportsList);
  };

  const drawRoutes = (routesList: RouteStats[], airportsList: AirportInfo[]) => {
    if (!map.current) return;

    const airportMap = new Map<string, AirportInfo>();
    airportsList.forEach((airport) => {
      airportMap.set(airport.name, airport);
    });

    routesList.forEach((route) => {
      const origin = airportMap.get(route.origin);
      const dest = airportMap.get(route.dest);

      if (origin && dest && origin.lat && origin.lng && dest.lat && dest.lng) {
        const delayPercentage = route.delayPercentage;
        const color =
          delayPercentage > 40
            ? '#ef4444'
            : delayPercentage > 30
              ? '#f59e0b'
              : delayPercentage > 20
                ? '#fbbf24'
                : '#10b981';

        const thickness = Math.max(1, Math.min(5, route.delayedFlights / 50));

        const polyline = L.polyline([[origin.lat, origin.lng], [dest.lat, dest.lng]], {
          color,
          weight: thickness,
          opacity: 0.6,
          smoothFactor: 1,
        }).addTo(map.current!);

        const popup = L.popup().setContent(
          `<div class="text-sm">
            <strong>${route.origin} → ${route.dest}</strong><br/>
            Delayed: ${route.delayPercentage.toFixed(1)}%<br/>
            Avg Delay: ${route.averageDepDelay.toFixed(0)} min
          </div>`
        );

        polyline.bindPopup(popup);
      }
    });

    // Add airport markers
    airportsList.slice(0, 30).forEach((airport) => {
      if (airport.lat && airport.lng) {
        L.circleMarker([airport.lat, airport.lng], {
          radius: 4,
          fillColor: '#3b82f6',
          color: '#1e40af',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        })
          .bindPopup(`<strong>${airport.name}</strong><br/>${airport.city}, ${airport.state}`)
          .addTo(map.current!);
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">Flight Routes Map</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <p className="text-sm text-gray-600">
          Red lines = high delays (&gt;40%) | Orange = medium delays (30-40%) | Yellow = low
          delays (20-30%) | Green = minimal delays (&lt;20%)
        </p>
      </div>

      <motion.div
        ref={mapContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full h-[600px] rounded-lg shadow-md border border-gray-200 overflow-hidden"
      />

      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Top Routes by Delays</h2>
        <div className="space-y-2">
          {routes.slice(0, 10).map((route, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100"
            >
              <div>
                <strong>{route.origin}</strong> → <strong>{route.dest}</strong>
                <p className="text-sm text-gray-600">
                  {route.delayPercentage.toFixed(1)}% delayed | Avg:{' '}
                  {route.averageDepDelay.toFixed(0)} min
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {route.totalFlights} flights
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
