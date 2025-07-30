import { writable } from 'svelte/store';
import { objectStore, arrayStore } from 'svelte-capacitor-store';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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
    mapSourceUrl: string;
}

type MapPosition = {
    dataTypeVersion: 0;
    location: L.LatLng,
    zoomLevel: number
}

type Page = 'loading' | 'main' | 'onboarding' | 'forceStaticGtfsUpdate' | 'settings' | 'about' | 'dependencyAcknowledgments';

// data gets loaded into here from storage in the loadStaticGtfsStoreData() function
export const staticGtfsDataStore = writable<StaticGtfsData>({
    dataTypeVersion: 0,
    timestamp: new Date().toString(),
    agencyName: "None",
    stops: {},
    routes: {},
    trips: {}
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
        vehicleMarkerBackgroundBrightness: 1,
        mapSourceUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
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

export async function loadStaticGtfsStoreData() {
    const platform = Capacitor.getPlatform();

    try {
        if (platform === 'android') {
            const loadedFile = await Filesystem.readFile({
                directory: Directory.Data,
                path: 'staticGtfsStore.json',
                encoding: Encoding.UTF16
            });

            staticGtfsDataStore.set(JSON.parse(loadedFile.data as string) as StaticGtfsData);
        } else if (platform === 'web') {
            const localStorageValue = localStorage.getItem('com.jakubhlavacek.gtfsrealtimemap.staticGtfsStore');
            if (!localStorageValue) {throw Error('Static GTFS store key not found in localstorage')};

            staticGtfsDataStore.set(JSON.parse(localStorageValue) as StaticGtfsData);
        }
    } catch {
        console.warn('Failed to load static GTFS data from storage')
    }
}

async function saveStaticGtfsStoreData(value: StaticGtfsData) {
    const platform = Capacitor.getPlatform();

    if (platform === 'android') {
        await Filesystem.writeFile({
            directory: Directory.Data,
            path: 'staticGtfsStore.json',
            encoding: Encoding.UTF16,
            data: JSON.stringify(value)
        });
    } else if (platform === 'web') {
        localStorage.setItem('com.jakubhlavacek.gtfsrealtimemap.staticGtfsStore', JSON.stringify(value));
    }
}

staticGtfsDataStore.subscribe(saveStaticGtfsStoreData);