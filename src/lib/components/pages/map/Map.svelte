<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import stopIconUrl from "$lib/map-icons/stop.svg";

    import L from "leaflet";
    import { onMount, onDestroy } from "svelte";

    import { fetchStaticGtfs, fetchRealtimeGtfs } from '$lib/gtfs/api';
    import { staticGtfsDataStore, realtimeGtfsDataStore } from '../../../../stores';
    import type { Stop, Vehicle } from '$lib/gtfs/types';

    let map: L.Map;
    let updateInterval: ReturnType<typeof setInterval>;

    let stopsLastDrawn: Stop[] = [];
    const stopMarkers: Record<string, L.Marker> = {};
    const vehicleMarkers: Record<string, L.Marker> = {};

    const stopIcon = L.icon({
        iconUrl: stopIconUrl,
        iconSize: L.point(15, 15)
    });

    function drawStops() {
        const bounds = map.getBounds();
        const boundsWithPadding = bounds.pad(0.25); // padded by 25%
        const zoomLevel = map.getZoom();

        // Check which stops should be drawn (none, if not zoomed-in enough in the first place)
        const stopsToBeDrawn: Stop[] = [];

        if (zoomLevel >= 13) {
            for (const stop of Object.values($staticGtfsDataStore.stops)) {
                // Is the station within bounds of the map? Avoid drawing it unenecessarily
                // (this can actually help out a ton with performance)
                if (!boundsWithPadding.contains([stop.location.latitude, stop.location.longitude])) {continue};

                // Skip drawing doors and generic nodes (at least for now)
                if (stop.type === 'door' || stop.type === 'generic') {continue};

                // At higher zoom levels, switch from showing parents to showing children
                if (stop.parentStopId && zoomLevel < 17) {continue};
                if (stop.hasChildren && zoomLevel >= 17) {continue};

                // Draw the stop if not done before
                stopsToBeDrawn.push(stop);
                if (stopsLastDrawn.includes(stop)) {continue};

                const marker = L.marker([stop.location.latitude, stop.location.longitude], {icon: stopIcon});
                marker.addTo(map);
                marker.bindPopup(`<b>${stop.name}</b>`);
                stopMarkers[stop.id] = marker;
            }
        }

        // Remove no longer displayed stops
        for (const stop of stopsLastDrawn) {
            if (!stopsToBeDrawn.includes(stop)) {
                map.removeLayer(stopMarkers[stop.id]);
                delete stopMarkers[stop.id];
            }
        }

        stopsLastDrawn = stopsToBeDrawn;
    }

    function drawVehicles() {
        let currentlyDrawnVehiclesIds: string[] = [];

        for (const vehicle of $realtimeGtfsDataStore.vehicles) {
            // If the vehicle doesn't have a position attached, there's no point in drawing it
            if (!vehicle.position) {continue};
            
            currentlyDrawnVehiclesIds.push(vehicle.id);

            // If the vehicle doesn't have a marker yet, create a blank one
            if (!Object.keys(vehicleMarkers).includes(vehicle.id)) {
                const marker = L.marker([0, 0], {interactive: true}).addTo(map);
                marker.bindPopup('<div id="vehicle-popup" style="width: 500px; height: 200px"></div>');
                marker.addEventListener("popupopen", function() {setTimeout(function() {onVehiclePopupClick(vehicle)}, 200)});

                vehicleMarkers[vehicle.id] = marker;
            }

            // Now update the existing marker with current information
            const marker = vehicleMarkers[vehicle.id];
            marker.setLatLng([vehicle.position.location.latitude, vehicle.position.location.longitude]);
        }

        // Remove no longer current vehicle markers
        let vehicleIdsToRemove: string[] = [];
        for (const vehicleId of Object.keys(vehicleMarkers)) {
            if (!currentlyDrawnVehiclesIds.includes(vehicleId)) {
                vehicleIdsToRemove.push(vehicleId);
            }
        }
        
        for (const vehicleId of vehicleIdsToRemove) {
            map.removeLayer(vehicleMarkers[vehicleId]);
            delete vehicleMarkers[vehicleId];
        }
    }

    function updateMarkers() {
        // Remove any existing markers and all them back in
        // This is done after zooming and GTFS realtime
        // updates to update the map.
        drawStops();
        drawVehicles();
    }

    function onVehiclePopupClick(vehicle: Vehicle) {
        const popupElement = document.getElementById('vehicle-popup') as HTMLDivElement;
        if (!popupElement) {console.warn("Failed to find vehicle popup")};

        function getPopupContent(vehicle: Vehicle): string {
            // First, try to get the vehicle's trip
            if (!vehicle.tripId || !Object.keys($staticGtfsDataStore.trips).includes(vehicle.tripId)) {return "Unknown trip. Consider refreshing static GTFS data?"}
            const trip = $staticGtfsDataStore.trips[vehicle.tripId];

            // Now, try to get the route
            if (!Object.keys($staticGtfsDataStore.routes).includes(trip.routeId)) {return trip.headsign || "No trip information. Consider refreshing static GTFS data?"};
            const route = $staticGtfsDataStore.routes[trip.routeId];

            return route.id;
        }

        popupElement.innerHTML = getPopupContent(vehicle);
    }

    onMount(function() {
       map = L.map('map');
       map.setView([50.0869250, 14.4207550], 4)
       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        updateInterval = setInterval(updateMarkers, 2000);
        map.addEventListener("zoomend", updateMarkers);
        map.addEventListener("moveend", updateMarkers);
    });

    onDestroy(function() {
        clearInterval(updateInterval);
    });
</script>

<style>
    #map {
        width: 1000px;
        height: 500px;
    }
</style>

<div id="map"></div>
<br> <button on:click={function() {fetchStaticGtfs('http://localhost:8000/gtfs.zip')}}>Update static</button>
<br> <button on:click={function() {fetchRealtimeGtfs('http://localhost:8000/gtfsReal.dat')}}>Update realtime</button>

{Object.keys(vehicleMarkers).length} vehicles