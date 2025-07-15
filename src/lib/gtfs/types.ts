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