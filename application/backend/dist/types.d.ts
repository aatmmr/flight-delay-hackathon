export interface Flight {
    year: number;
    month: number;
    dayOfMonth: number;
    dayOfWeek: number;
    carrier: string;
    originAirportId: number;
    originAirportName: string;
    originCity: string;
    originState: string;
    destAirportId: number;
    destAirportName: string;
    destCity: string;
    destState: string;
    crsDepTime: number;
    depDelay: number;
    depDel15: number;
    crsArrTime: number;
    arrDelay: number;
    arrDel15: number;
    cancelled: number;
}
export interface Route {
    originAirportId: number;
    originAirportName: string;
    originCity: string;
    originState: string;
    destAirportId: number;
    destAirportName: string;
    destCity: string;
    destState: string;
}
export interface RouteKey {
    origin: string;
    dest: string;
}
export interface DelayStats {
    carrier: string;
    totalFlights: number;
    delayedFlights: number;
    averageDepDelay: number;
    averageArrDelay: number;
    delayPercentage: number;
}
export interface RouteStats {
    origin: string;
    originName: string;
    dest: string;
    destName: string;
    totalFlights: number;
    delayedFlights: number;
    averageDepDelay: number;
    averageArrDelay: number;
    delayPercentage: number;
}
export interface AirportInfo {
    id: number;
    name: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
}
export interface SearchQuery {
    origin?: string;
    destination?: string;
    carrier?: string;
    minDate?: string;
    maxDate?: string;
    minDelay?: number;
    maxDelay?: number;
    page?: number;
    limit?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface AnalyticsResponse {
    delaysByCarrier: DelayStats[];
    delaysByDayOfWeek: Record<number, DelayStats>;
    delaysByMonth: Record<number, DelayStats>;
    topRoutes: RouteStats[];
}
export interface ApiError {
    error: string;
    status: number;
}
//# sourceMappingURL=types.d.ts.map