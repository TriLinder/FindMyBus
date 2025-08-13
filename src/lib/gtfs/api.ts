import { CapacitorHttp } from '@capacitor/core';
import type { HttpOptions, HttpResponse } from '@capacitor/core';
import { unzipSync, strFromU8 } from 'fflate';
import Papa from 'papaparse';
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

import { staticGtfsDataStore, realtimeGtfsDataStore } from '../../stores';
import type { Stop, Route, Trip, StopTimes, Vehicle } from './types';

import { getStopTimesDataKeyFromTripId } from '$lib/utils';
import { saveDataInChunks } from '$lib/file-storage';

const USER_AGENT = 'findmybus-app';

function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function parseUnzipedCsvFile(fileData: Uint8Array): Array<Record<string, string | number>> {
    const string = strFromU8(fileData);
    const parsed = Papa.parse(string, {header: true, skipEmptyLines: true, dynamicTyping: true});
    return parsed.data as Array<Record<string, string>>;
}

// The types here aren't perfect, as some of these fields are optional in the GTFS spec.
// However, these are the fields this app expects, and there should be better error-handling
// in the future.

type AgencyFile = {
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
}[];

type StopsFile = {
    stop_id: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    location_type: number;
    parent_station: string;
}[];

type RoutesFile = {
    route_id: string;
    route_short_name: string | undefined;
    route_long_name: string | undefined;
    route_type: string;
    route_color: string | undefined;
    route_text_color: string | undefined;
}[];

type TripsFile = {
    trip_id: string;
    route_id: string;
    trip_headsign: string | undefined;
}[];

type StopTimesFile = {
    trip_id: string;
    arrival_time: string;
    departure_time: string | undefined;
    end_pickup_drop_off_window: string | undefined;
    stop_id: string;
    stop_sequence: number;
}[];

export async function fetchStaticGtfs(url: string) {
    // fetch the GTFS static file, which is a zip file
    const options: HttpOptions = {
        url: url,
        responseType: 'blob',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'User-Agent': USER_AGENT
        },
        connectTimeout: 4000,
        readTimeout: 4000
    }

    const response: HttpResponse = await CapacitorHttp.get(options);
    console.log(`GTFS static data received. Size: ${response.data.length / (1024 * 1024)} MB`);

    // unzip it
    const files = unzipSync(base64ToUint8Array(response.data));
    console.log(`Unzipped, found ${Object.keys(files).length} files.`);

    // assert we've got the necessary files
    const expectedFiles = ['agency.txt', 'stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt'];

    for (const file of expectedFiles) {
        if (!files[file]) {
            throw new Error(`Expected file ${file} not found in GTFS static data.`);
        }
    }

    // get agency name
    const agencyName = (parseUnzipedCsvFile(files['agency.txt']) as AgencyFile)[0].agency_name;
    if (!agencyName) {throw new Error('Failed to find agency name')};
    console.log(`Agency: ${agencyName}`);

    // parse stops
    const stopsFile = parseUnzipedCsvFile(files['stops.txt']) as StopsFile;
    console.log(`Stops: ${stopsFile.length}`);

    const stops: Record<string, Stop> = {};
    const parentStopIds: string[] = [];

    for (const record of stopsFile) {
        const locationTypeMap = {
            0: 'stop',
            1: 'station',
            2: 'door',
            3: 'generic',
            4: 'boardingArea',
        } as const;

        const parentStopId = record.parent_station || null;
        if (parentStopId) {
            parentStopIds.push(parentStopId);
        }

        stops[record.stop_id] = {
            id: record.stop_id,
            name: record.stop_name,
            location: {
                latitude: record.stop_lat,
                longitude: record.stop_lon
            },
            type: record.location_type ? locationTypeMap[record.location_type as keyof typeof locationTypeMap] : 'stop',
            parentStopId: parentStopId || null,
            hasChildren: false, // this is actually set in the next loop
        };
    }

    for (const stopId of parentStopIds) {
        stops[stopId].hasChildren = true;
    }

    // parse routes
    const routesFile = parseUnzipedCsvFile(files['routes.txt']) as RoutesFile;
    console.log(`Routes: ${routesFile.length}`);

    const routes: Record<string, Route> = {};

    for (const record of routesFile) {
        const routeTypeMap = {
            '0': 'tram',
            '1': 'subway',
            '2': 'train',
            '3': 'bus',
            '4': 'ferry',
            '5': 'cableTram',
            '6': 'cableCar',
            '7': 'funicular',
            '8': 'trolleybus',
            '9': 'monorail'
        } as const;

        routes[record.route_id] = {
            id: record.route_id,
            name: {
                short: record.route_short_name ? record.route_short_name.toString() : null,
                long: record.route_long_name ? record.route_long_name.toString() : null
            },
            type: routeTypeMap[record.route_type as keyof typeof routeTypeMap],
            color: {
                generic: record.route_color || null,
                text: record.route_text_color || null
            }
        };
    }

    // parse trips
    const tripsFile = parseUnzipedCsvFile(files['trips.txt']) as TripsFile;
    console.log(`Trips: ${tripsFile.length}`);

    const trips: Record<string, Trip> = {};

    for (const record of tripsFile) {
        trips[record.trip_id] = {
            id: record.trip_id,
            routeId: record.route_id,
            headsign: record.trip_headsign || null
        };
    }

    // parse stop times (and save them per trip id)
    const stopTimesFile = parseUnzipedCsvFile(files['stop_times.txt']) as StopTimesFile;
    console.log(`Individual stop time records: ${stopTimesFile.length}`);

    stopTimesFile.sort((a, b) => a.stop_sequence - b.stop_sequence); // sort the individual stops by their sequence

    const stopTimesPerTrip: Record<string, StopTimes> = {};

    for (const stopTime of stopTimesFile) {
        if (!stopTime.departure_time && !stopTime.end_pickup_drop_off_window) {continue};
        const departureTime = (stopTime.departure_time || stopTime.end_pickup_drop_off_window) as string; // one of them, has to be defined (acoording to the spec and also checked above)

        if (!stopTimesPerTrip[stopTime.trip_id]) {
            stopTimesPerTrip[stopTime.trip_id] = [];
        }

        stopTimesPerTrip[stopTime.trip_id].push({
            stopId: stopTime.stop_id,
            departureTime: departureTime
        });
    }

    console.log(`Saved stop times for ${Object.keys(stopTimesPerTrip).length} trips.`);

    // as the stop time records are by far the largest in size, and also not needed until a specific vehicle is clicked on,
    // we save them in their own files, bunched together based on the first character of a hash of their ID,
    // so they're evenly distributed across the files, even if the actual ID numbers aren't
    const tripStopTimesPerKey: Record<string, Record<string, StopTimes>> = {};

    for (const [tripId, stopTimes] of Object.entries(stopTimesPerTrip)) {
        const key = await getStopTimesDataKeyFromTripId(tripId);

        if (!tripStopTimesPerKey[key]) {
            tripStopTimesPerKey[key] = {};
        }

        tripStopTimesPerKey[key][tripId] = stopTimes;
    }

    console.log(`Split stop times under ${Object.keys(tripStopTimesPerKey).length} keys.`);

    // save the parsed info
    staticGtfsDataStore.set({
        dataTypeVersion: 0,
        timestamp: new Date().toString(),
        agencyName: agencyName,
        stops: stops,
        routes: routes,
        trips: trips
    });

    console.log("Saved to store.");

    // skip saving the stop times on web, due to localStorage size limits
    for (const [key, stopTimeRecords] of Object.entries(tripStopTimesPerKey)) {
        await saveDataInChunks(key, JSON.stringify(stopTimeRecords));
    }

    console.log("Saved stop times to data storage.");
    console.log("Parsing and saving static GTFS done.");
}

export async function fetchRealtimeGtfs(url: string) {
    // fetch the GTFS realtime file, which is a protobuf file
    const options: HttpOptions = {
        url: url,
        responseType: 'arraybuffer',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'User-Agent': USER_AGENT
        },
        connectTimeout: 4000,
        readTimeout: 4000
    }

    const response: HttpResponse = await CapacitorHttp.get(options);
    console.log(`GTFS realtime data received. Size: ${response.data.length / (1024 * 1024)} MB`);

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(base64ToUint8Array(response.data));
    console.log(`GTFS realtime feed contains ${feed.entity.length} entities.`);

    // get the feed's timestamp
    const feedTimestamp = new Date(feed.header.timestamp as number * 1000).toString();

    // parse vehicles
    const vehicles: Vehicle[] = [];

    for (const entity of feed.entity) {
        if (entity.vehicle) {
            const vehicle = entity.vehicle;
            vehicles.push({
                id: entity.vehicle.vehicle && entity.vehicle.vehicle.id ? entity.vehicle.vehicle.id : Math.random().toString(),
                tripId: entity.vehicle.trip && entity.vehicle.trip.tripId ? entity.vehicle.trip.tripId : null,
                currentStopId: vehicle.stopId || null,
                position: vehicle.position?.latitude && vehicle.position?.longitude ? {
                    location: {
                        latitude: vehicle.position?.latitude,
                        longitude: vehicle.position?.longitude
                    },
                    bearing: vehicle.position?.bearing || null,
                    speed: vehicle.position?.speed || null // Speed in meters per second
                } : null
            });
        }
    }

    console.log(`Parsed ${vehicles.length} vehicles from GTFS realtime feed.`);

    // save the parsed info
    realtimeGtfsDataStore.set({
        localTimestamp: new Date().toString(),
        feedTimestamp: feedTimestamp,
        vehicles: vehicles
    });
}