<script lang="ts">
    import 'leaflet/dist/leaflet.css';
    import stopIconUrl from "$lib/map-icons/stop.svg";

    import L from "leaflet";
    import { onMount, onDestroy } from "svelte";

    import { fetchStaticGtfs, fetchRealtimeGtfs } from '$lib/gtfs/api';
    import { staticGtfsDataStore, realtimeGtfsDataStore, mapPositionStore } from '../../../../stores';
    import type { Stop, Vehicle } from '$lib/gtfs/types';
    import VehiclePopup from './VehiclePopup.svelte';

    let map: L.Map;
    let updateInterval: ReturnType<typeof setInterval>;

    let stopsLastDrawn: Stop[] = [];
    const stopMarkers: Record<string, L.Marker> = {};
    const vehicleMarkers: Record<string, L.Marker> = {};

    let selectedVehicle: Vehicle;

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
        const bounds = map.getBounds();
        const boundsWithPadding = bounds.pad(0); // padded by 50%

        const currentlyDrawnVehiclesIds: string[] = [];

        for (const vehicle of $realtimeGtfsDataStore.vehicles) {
            // If the vehicle doesn't have a position attached, there's no point in drawing it
            if (!vehicle.position) {continue};

            // If the vehicle is really out of bounds, don't draw it either
            // (though the popup closing isn't great, that's why the bounds are padded)
            if (!boundsWithPadding.contains([vehicle.position.location.latitude, vehicle.position.location.longitude])) {continue};

            currentlyDrawnVehiclesIds.push(vehicle.id);
            const markerIconElementId = `vehicle-marker-${btoa(vehicle.id)}`;

            // If the vehicle doesn't have a marker yet, create one
            if (!Object.keys(vehicleMarkers).includes(vehicle.id)) {
                const marker = L.marker([0, 0], {interactive: true}).addTo(map);
                marker.bindPopup('<div id="vehicle-popup" style="width: 300px;"></div>', {autoPan: false});
                marker.addEventListener("popupopen", function() {onVehiclePopupClick(vehicle)});

                // Try to use the vehicle's route short name as a label, otherwise
                // leave it empty
                let label = "";
                let genericColor = '';
                let textColor = '';
                if (vehicle.tripId && Object.keys($staticGtfsDataStore.trips).includes(vehicle.tripId)) {
                    const trip = $staticGtfsDataStore.trips[vehicle.tripId];
                    if (Object.keys($staticGtfsDataStore.routes).includes(trip.routeId)) {
                        const route = $staticGtfsDataStore.routes[trip.routeId];

                        genericColor = '#' + (route.color.generic || '000000');
                        textColor = '#' + (route.color.text || 'ffffff');

                        if (route.name.short && route.name.short.length > 1 && route.name.short.length <= 4) {
                            label = route.name.short;
                        }
                    }
            }

                marker.setIcon(L.divIcon({html: `<div id="${markerIconElementId}" class="vehicle-marker" style="color: ${textColor}; background-color: ${genericColor}">${label}</div>`, className: ''}));
                vehicleMarkers[vehicle.id] = marker;
            }

            // Now update the existing marker with current information
            const marker = vehicleMarkers[vehicle.id];
            marker.setLatLng([vehicle.position.location.latitude, vehicle.position.location.longitude]);

            // Update the icon
            const markerIconElement: HTMLDivElement | null = document.getElementById(markerIconElementId) as HTMLDivElement;
            if (!markerIconElement) {
                console.warn("Failed to find marker element.");
                continue;
            }

            // If we have bearing information, use an arrow with a rotation, otherwise use a dot
            if (vehicle.position.bearing) {
                markerIconElement.classList.add('vehicle-marker-arrow');
                markerIconElement.classList.remove('vehicle-marker-dot');
                markerIconElement.style.transform = `rotate(${vehicle.position.bearing}deg)`;
            } else {
                markerIconElement.classList.add('vehicle-marker-dot');
                markerIconElement.classList.remove('vehicle-marker-arrow');
                markerIconElement.style.transform = '';
            }
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

    function onMapInteraction() {
        updateMarkers();

        $mapPositionStore.location =  map.getCenter();
        $mapPositionStore.zoomLevel = map.getZoom();
    }

    function onVehiclePopupClick(vehicle: Vehicle) {
        selectedVehicle = vehicle;
        setTimeout(function() {replaceVehiclePopup()}, 200);
    }

    function replaceVehiclePopup() {
        const popupElement = document.getElementById('vehicle-popup') as HTMLDivElement;
        const templateElement = document.getElementById('vehicle-popup-template') as HTMLElement;
        if (!popupElement || !templateElement) {console.warn("Failed to find vehicle popup")};

        popupElement.outerHTML = templateElement.outerHTML;
    }

    onMount(function() {
        // Initialize the map
        map = L.map('map');

        map.setView(L.latLng($mapPositionStore.location), $mapPositionStore.zoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        updateInterval = setInterval(updateMarkers, 2000);
        map.addEventListener("zoomend", onMapInteraction);
        map.addEventListener("moveend", onMapInteraction);
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

    :global(.vehicle-marker) {
        display: flex;

        justify-content: center;

        font-weight: bold;
    }

    :global(.vehicle-marker-dot) {
        width: 25px;
        height: 25px;
        border-radius: 100%;

        align-items: center;
    }

    :global(.vehicle-marker-arrow) {
        width: 30px;
        height: 30px;
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);

        align-items: end;
    }
</style>

<div id="map"></div>
<br> <button on:click={function() {fetchStaticGtfs('http://localhost:8000/gtfs.zip')}}>Update static</button>
<br> <button on:click={function() {fetchRealtimeGtfs('http://localhost:8000/gtfsReal.dat')}}>Update realtime</button>

{Object.keys(vehicleMarkers).length} vehicles on screen

<!-- This is where the popup content gets pulled from when clicking on a vehicle -->
<div style="display: none;">
    <div id="vehicle-popup-template">
        {#if selectedVehicle}
            {#key selectedVehicle}
                <VehiclePopup vehicle={selectedVehicle}/>
            {/key}
        {:else}
            Failed to generate popup content.
        {/if}
    </div>
</div>