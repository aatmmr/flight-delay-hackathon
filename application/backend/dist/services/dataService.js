import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AIRPORT_COORDINATES = {
    'JFK': { lat: 40.6413, lng: -73.7781 },
    'LAX': { lat: 33.9425, lng: -118.4081 },
    'ORD': { lat: 41.8742, lng: -87.8073 },
    'DFW': { lat: 32.8975, lng: -97.038 },
    'DEN': { lat: 39.8561, lng: -104.6737 },
    'ATL': { lat: 33.6407, lng: -84.427 },
    'MIA': { lat: 25.7959, lng: -80.2870 },
    'SEA': { lat: 47.4502, lng: -122.3088 },
    'SFO': { lat: 37.6213, lng: -122.379 },
    'LAS': { lat: 36.0840, lng: -115.1537 },
    'PHX': { lat: 33.4484, lng: -112.0742 },
    'BOS': { lat: 42.3656, lng: -71.0096 },
    'LIH': { lat: 21.9805, lng: -159.3393 },
    'OGG': { lat: 20.8991, lng: -156.4695 },
    'KOA': { lat: 19.7387, lng: -155.9497 },
};
let flights = [];
let uniqueAirports = new Map();
let uniqueRoutes = new Map();
export async function loadFlightData(csvPath) {
    return new Promise((resolve, reject) => {
        const actualPath = csvPath.startsWith('/') ? csvPath : path.resolve(__dirname, csvPath);
        if (!fs.existsSync(actualPath)) {
            reject(new Error(`CSV file not found at ${actualPath}`));
            return;
        }
        const stream = fs.createReadStream(actualPath);
        const parsedFlights = [];
        stream
            .pipe(csvParser())
            .on('data', (row) => {
            const flight = {
                year: parseInt(row.Year),
                month: parseInt(row.Month),
                dayOfMonth: parseInt(row.DayofMonth),
                dayOfWeek: parseInt(row.DayOfWeek),
                carrier: row.Carrier,
                originAirportId: parseInt(row.OriginAirportID),
                originAirportName: row.OriginAirportName,
                originCity: row.OriginCity,
                originState: row.OriginState,
                destAirportId: parseInt(row.DestAirportID),
                destAirportName: row.DestAirportName,
                destCity: row.DestCity,
                destState: row.DestState,
                crsDepTime: parseInt(row.CRSDepTime),
                depDelay: parseInt(row.DepDelay) || 0,
                depDel15: parseInt(row.DepDel15) || 0,
                crsArrTime: parseInt(row.CRSArrTime),
                arrDelay: parseInt(row.ArrDelay) || 0,
                arrDel15: parseInt(row.ArrDel15) || 0,
                cancelled: parseInt(row.Cancelled) || 0,
            };
            parsedFlights.push(flight);
        })
            .on('end', () => {
            flights = parsedFlights;
            indexAirports();
            indexRoutes();
            console.log(`✓ Loaded ${flights.length} flights`);
            console.log(`✓ Indexed ${uniqueAirports.size} unique airports`);
            console.log(`✓ Indexed ${uniqueRoutes.size} unique routes`);
            resolve(flights);
        })
            .on('error', (err) => reject(err));
    });
}
function indexAirports() {
    uniqueAirports.clear();
    for (const flight of flights) {
        if (!uniqueAirports.has(flight.originAirportId)) {
            const code = flight.originAirportName.split(' ').pop() || '';
            const coords = AIRPORT_COORDINATES[code] || { lat: 0, lng: 0 };
            uniqueAirports.set(flight.originAirportId, {
                id: flight.originAirportId,
                name: flight.originAirportName,
                city: flight.originCity,
                state: flight.originState,
                lat: coords.lat,
                lng: coords.lng,
            });
        }
        if (!uniqueAirports.has(flight.destAirportId)) {
            const code = flight.destAirportName.split(' ').pop() || '';
            const coords = AIRPORT_COORDINATES[code] || { lat: 0, lng: 0 };
            uniqueAirports.set(flight.destAirportId, {
                id: flight.destAirportId,
                name: flight.destAirportName,
                city: flight.destCity,
                state: flight.destState,
                lat: coords.lat,
                lng: coords.lng,
            });
        }
    }
}
function indexRoutes() {
    uniqueRoutes.clear();
    for (const flight of flights) {
        const key = `${flight.originAirportId}-${flight.destAirportId}`;
        if (!uniqueRoutes.has(key)) {
            uniqueRoutes.set(key, {
                originAirportId: flight.originAirportId,
                originAirportName: flight.originAirportName,
                originCity: flight.originCity,
                originState: flight.originState,
                destAirportId: flight.destAirportId,
                destAirportName: flight.destAirportName,
                destCity: flight.destCity,
                destState: flight.destState,
            });
        }
    }
}
export function getAllFlights() {
    return flights;
}
export function getAirportInfo(airportId) {
    return uniqueAirports.get(airportId);
}
export function getAllAirports() {
    return Array.from(uniqueAirports.values());
}
export function searchFlights(query) {
    return flights.filter((flight) => {
        if (query.origin && flight.originAirportName !== query.origin)
            return false;
        if (query.destination && flight.destAirportName !== query.destination)
            return false;
        if (query.carrier && flight.carrier !== query.carrier)
            return false;
        if (query.minDelay !== undefined && flight.depDelay < query.minDelay)
            return false;
        if (query.maxDelay !== undefined && flight.depDelay > query.maxDelay)
            return false;
        if (query.year && flight.year !== query.year)
            return false;
        if (query.month && flight.month !== query.month)
            return false;
        return true;
    });
}
export function calculateDelayStats() {
    const stats = {};
    for (const flight of flights) {
        if (!stats[flight.carrier]) {
            stats[flight.carrier] = {
                carrier: flight.carrier,
                totalFlights: 0,
                delayedFlights: 0,
                averageDepDelay: 0,
                averageArrDelay: 0,
                delayPercentage: 0,
            };
        }
        stats[flight.carrier].totalFlights++;
        if (flight.depDel15 === 1) {
            stats[flight.carrier].delayedFlights++;
        }
        stats[flight.carrier].averageDepDelay += flight.depDelay;
        stats[flight.carrier].averageArrDelay += flight.arrDelay;
    }
    for (const carrier in stats) {
        stats[carrier].averageDepDelay /= stats[carrier].totalFlights;
        stats[carrier].averageArrDelay /= stats[carrier].totalFlights;
        stats[carrier].delayPercentage =
            (stats[carrier].delayedFlights / stats[carrier].totalFlights) * 100;
    }
    return stats;
}
export function calculateRouteStats() {
    const stats = {};
    for (const flight of flights) {
        const key = `${flight.originAirportId}-${flight.destAirportId}`;
        if (!stats[key]) {
            stats[key] = {
                origin: flight.originAirportName,
                originName: `${flight.originCity}, ${flight.originState}`,
                dest: flight.destAirportName,
                destName: `${flight.destCity}, ${flight.destState}`,
                totalFlights: 0,
                delayedFlights: 0,
                averageDepDelay: 0,
                averageArrDelay: 0,
                delayPercentage: 0,
            };
        }
        stats[key].totalFlights++;
        if (flight.depDel15 === 1) {
            stats[key].delayedFlights++;
        }
        stats[key].averageDepDelay += flight.depDelay;
        stats[key].averageArrDelay += flight.arrDelay;
    }
    const routeStatsArray = Object.values(stats);
    routeStatsArray.forEach((route) => {
        route.averageDepDelay /= route.totalFlights;
        route.averageArrDelay /= route.totalFlights;
        route.delayPercentage = (route.delayedFlights / route.totalFlights) * 100;
    });
    return routeStatsArray.sort((a, b) => b.delayedFlights - a.delayedFlights);
}
export function calculateDelayStatsByDayOfWeek() {
    const stats = {};
    for (const flight of flights) {
        const day = flight.dayOfWeek;
        if (!stats[day]) {
            stats[day] = {
                carrier: `Day ${day}`,
                totalFlights: 0,
                delayedFlights: 0,
                averageDepDelay: 0,
                averageArrDelay: 0,
                delayPercentage: 0,
            };
        }
        stats[day].totalFlights++;
        if (flight.depDel15 === 1) {
            stats[day].delayedFlights++;
        }
        stats[day].averageDepDelay += flight.depDelay;
        stats[day].averageArrDelay += flight.arrDelay;
    }
    for (const day in stats) {
        stats[day].averageDepDelay /= stats[day].totalFlights;
        stats[day].averageArrDelay /= stats[day].totalFlights;
        stats[day].delayPercentage = (stats[day].delayedFlights / stats[day].totalFlights) * 100;
    }
    return stats;
}
export function calculateDelayStatsByMonth() {
    const stats = {};
    for (const flight of flights) {
        const month = flight.month;
        if (!stats[month]) {
            stats[month] = {
                carrier: `Month ${month}`,
                totalFlights: 0,
                delayedFlights: 0,
                averageDepDelay: 0,
                averageArrDelay: 0,
                delayPercentage: 0,
            };
        }
        stats[month].totalFlights++;
        if (flight.depDel15 === 1) {
            stats[month].delayedFlights++;
        }
        stats[month].averageDepDelay += flight.depDelay;
        stats[month].averageArrDelay += flight.arrDelay;
    }
    for (const month in stats) {
        stats[month].averageDepDelay /= stats[month].totalFlights;
        stats[month].averageArrDelay /= stats[month].totalFlights;
        stats[month].delayPercentage =
            (stats[month].delayedFlights / stats[month].totalFlights) * 100;
    }
    return stats;
}
export function getUniqueCarriers() {
    const carriers = new Set();
    for (const flight of flights) {
        carriers.add(flight.carrier);
    }
    return Array.from(carriers).sort();
}
export function getUniqueAirportNames() {
    const airports = new Set();
    for (const flight of flights) {
        airports.add(flight.originAirportName);
        airports.add(flight.destAirportName);
    }
    return Array.from(airports).sort();
}
//# sourceMappingURL=dataService.js.map