import { writable } from 'svelte/store';
import { objectStore } from 'svelte-capacitor-store';

import type { Stop, Route, Trip, Vehicle } from "$lib/gtfs/types";

type StaticGtfsData = {
    dataTypeVersion: 0;
    timestamp: string;
    agencyName: string;
    stops: Record<string, Stop>;
    routes: Record<string, Route>;
    trips: Record<string, Trip>;
}

type RealtimeGtfsData = {
    localTimestamp: string;
    feedTimestamp: string;
    vehicles: Vehicle[]
}

export const staticGtfsDataStore = objectStore<StaticGtfsData>({
    storeName: "com.jakubhlavacek.gtfsrealtimemap.staticGtfsData",
    initialValue: {
        dataTypeVersion: 0,
        timestamp: new Date().toString(),
        agencyName: "None",
        stops: {},
        routes: {},
        trips: {}
    },
    persist: true
});

export const realtimeGtfsDataStore = writable<RealtimeGtfsData>({
    localTimestamp: new Date().toString(),
    feedTimestamp: new Date().toString(),
    vehicles: []
});