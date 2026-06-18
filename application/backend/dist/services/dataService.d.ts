import { Flight, DelayStats, RouteStats, AirportInfo } from '../types.js';
export declare function loadFlightData(csvPath: string): Promise<Flight[]>;
export declare function getAllFlights(): Flight[];
export declare function getAirportInfo(airportId: number): AirportInfo | undefined;
export declare function getAllAirports(): AirportInfo[];
export declare function searchFlights(query: {
    origin?: string;
    destination?: string;
    carrier?: string;
    minDelay?: number;
    maxDelay?: number;
    year?: number;
    month?: number;
}): Flight[];
export declare function calculateDelayStats(): Record<string, DelayStats>;
export declare function calculateRouteStats(): RouteStats[];
export declare function calculateDelayStatsByDayOfWeek(): Record<number, DelayStats>;
export declare function calculateDelayStatsByMonth(): Record<number, DelayStats>;
export declare function getUniqueCarriers(): string[];
export declare function getUniqueAirportNames(): string[];
//# sourceMappingURL=dataService.d.ts.map