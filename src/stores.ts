import { writable } from 'svelte/store';
import { objectStore, arrayStore } from 'svelte-capacitor-store';
import L from "leaflet";

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

type Settings = {
    dataTypeVersion: 0;
    staticGtfsUrl: string;
    realtimeGtfsUrl: string;
    realtimeGtfsUpdateInterval: number;
    language: 'en' | 'cs';
    speedUnits: 'kmph' | 'mph' | 'mps';
    timeFormat: '12hour' | '24hour';
    darkMode: 'on' | 'off' | 'system';
    theme: 'ios' | 'material';
    showVehicleMarkerLabels: boolean;
    vehicleMarkerBackgroundBrightness: number;
}

type MapPosition = {
    dataTypeVersion: 0;
    location: L.LatLng,
    zoomLevel: number
}

type Page = 'loading' | 'main' | 'onboarding' | 'settings' | 'about' | 'dependencyAcknowledgments';

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

export const settingsStore = objectStore<Settings>({
    storeName: 'com.jakubhlavacek.gtfsrealtimemap.settings',
    initialValue: {
        dataTypeVersion: 0,
        staticGtfsUrl: '',
        realtimeGtfsUrl: '',
        realtimeGtfsUpdateInterval: 5,
        language: 'en',
        speedUnits: 'kmph',
        timeFormat: '24hour',
        darkMode: 'off',
        theme: 'material',
        showVehicleMarkerLabels: true,
        vehicleMarkerBackgroundBrightness: 1
    },
    persist: true
});

export const mapPositionStore = objectStore<MapPosition>({
    storeName: "com.jakubhlavacek.gtfsrealtimemap.mapPositionStore",
    initialValue: {
        dataTypeVersion: 0,
        location: L.latLng([50.0869250, 14.4207550]),
        zoomLevel: 4
    },
    persist: true
});

export const finishedInteractionsStore = arrayStore<('onboarding')[]>({
    storeName: "com.jakubhlavacek.gtfsrealtimemap.finishedInteractions",
    initialValue: [],
    persist: true
});

export const currentPageStore = writable<Page>('loading');