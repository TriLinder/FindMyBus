export type Location = {
    latitude: number;
    longitude: number;
}

export type Stop = {
    id: string;
    name: string;
    location: Location;
    type: 'stop' | 'station' | 'door' | 'generic' | 'boardingArea';
    parentStopId: string | null;
    hasChildren: boolean;
}

export type Route = {
    id: string;
    name: {
        short: string | null;
        long: string | null;
    }
    type: 'tram' | 'subway' | 'train' | 'bus' | 'ferry' | 'cableTram' | 'cableCar' | 'funicular' | 'trolleybus' | 'monorail';
    color: {
        generic: string | null;
        text: string | null;
    }
}

export type Trip = {
    id: string;
    routeId: string;
    headsign: string | null;
}

export type Vehicle = {
    id: string;
    tripId: string | null;
    position: {
        location: Location;
        bearing: number | null;
        speed: number | null; // Speed in meters per second
    } | null;
}