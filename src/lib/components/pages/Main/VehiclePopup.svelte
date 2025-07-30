<script lang="ts">
    import { _ } from "svelte-i18n";
    import { staticGtfsDataStore } from "../../../../stores";
    import { parseStopTimeStringToLocalTimezoneToday, speedInUsersPreferredUnitsString } from "$lib/utils";
    import type { Vehicle, Stop, Trip, Route } from "$lib/gtfs/types";

    import { Button } from "konsta/svelte";
    import Icon from "svelte-awesome";
    import type { IconData } from "svelte-awesome/components/Icon.svelte";
    import mapPin from 'svelte-awesome/icons/mapPin';
    import flag from 'svelte-awesome/icons/flag';
    import dashboard from 'svelte-awesome/icons/dashboard';
    import subway from 'svelte-awesome/icons/subway';
    import train from 'svelte-awesome/icons/train';
    import bus from 'svelte-awesome/icons/bus';
    import ship from 'svelte-awesome/icons/ship';
    import arrowCircleOUp from 'svelte-awesome/icons/arrowCircleOUp';
    import road from 'svelte-awesome/icons/road';

    export let vehicle: Vehicle;

    let trip: Trip;
    let route: Route;

    let tripLabel: string;
    let genericColor: string;
    let textColor: string;

    let currentStop: Stop | null;
    let terminusStop: Stop | null;
    let upcomingStop: Stop | null;
    let speedString: string | null = null;
    let routeType: {icon: Record<string, IconData>, label: string} | null = null;

    let errorMessage: string | undefined = undefined;

    function load() {
        // We assume we have the vehicle's position information,
        // otherwise there's not even any way for the popup to be
        // displayed in the first place.
        if (!vehicle.position) {return $_('map.vehiclePopup.errors.noPosition')};

        // First, try to get the vehicle's trip
        if (!vehicle.tripId || !Object.keys($staticGtfsDataStore.trips).includes(vehicle.tripId)) {return $_('map.vehiclePopup.errors.unknownTrip')}
        trip = $staticGtfsDataStore.trips[vehicle.tripId];

        // Now, try to get the route
        if (!Object.keys($staticGtfsDataStore.routes).includes(trip.routeId)) {return $_('map.vehiclePopup.errors.unknownRoute')};
        route = $staticGtfsDataStore.routes[trip.routeId];

        // The best way to identify the trip is by its headsign, though
        // otherwise the users probably expects to see its terminus stop.
        terminusStop = $staticGtfsDataStore.stops[trip.stopTimes.at(-1)?.stopId!] || null;

        if (trip.headsign) {tripLabel = trip.headsign}
            else if (terminusStop) {tripLabel = terminusStop.name}
            else {tripLabel = "Unknown"}

        // Get colors for the short route name tag
        genericColor = '#' + (route.color.generic || '000000');
        textColor = '#' + (route.color.text || 'ffffff');

        // Get the vehicle's current stop
        currentStop = $staticGtfsDataStore.stops[vehicle.currentStopId!] || null;

        // Get the upcoming stop, based on the timetable (the first one with its departure time in the future)
        for (const stopTime of trip.stopTimes) {
            const time = parseStopTimeStringToLocalTimezoneToday(stopTime.departureTime);
            if (time > new Date()) {
                upcomingStop = $staticGtfsDataStore.stops[stopTime.stopId] || null;
                break;
            }
        }

        // Get the vehicle's speed and convert it
        // (only to kmph for now)
        speedString = vehicle.position.speed ? speedInUsersPreferredUnitsString(vehicle.position.speed) : null;

        // Get the route type
        if (route.type) {
            switch (route.type) {
                case('tram'): routeType = {icon: train, label: $_("map.vehiclePopup.routeType.tram")}; break;
                case('subway'): routeType = {icon: subway, label: $_("map.vehiclePopup.routeType.subway")}; break;
                case('train'): routeType = {icon: train, label: $_("map.vehiclePopup.routeType.train")}; break;
                case('bus'): routeType = {icon: bus, label: $_("map.vehiclePopup.routeType.bus")}; break;
                case('ferry'): routeType = {icon: ship, label: $_("map.vehiclePopup.routeType.ferry")}; break;
                case('cableTram'): routeType = {icon: train, label: $_("map.vehiclePopup.routeType.cableTram")}; break;
                case('cableCar'): routeType = {icon: arrowCircleOUp, label: $_("map.vehiclePopup.routeType.cableCar")}; break;
                case('funicular'): routeType = {icon: arrowCircleOUp, label: $_("map.vehiclePopup.routeType.funicular")}; break;
                case('trolleybus'): routeType = {icon: bus, label: $_("map.vehiclePopup.routeType.trolleybus")}; break;
                case('monorail'): routeType = {icon: train, label: $_("map.vehiclePopup.routeType.monorail")}; break;
            }
        }
    }

    errorMessage = load();
</script>

<style>
    .popup-container {
        width: 100%;
        background-color: white;
    }

    .header {
        font-weight: bold;
    }

    .tag {
        padding: 5px;
    }

    hr {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .stop-times-button-container {
        margin-top: 15px;
    }
</style>

{#if !errorMessage}
    <div class="popup-container">
        <div class="header">
            <span class="tag" style:color={textColor} style:background-color={genericColor}>{route.name.short}</span>
            <span class="label">{tripLabel}</span>
        </div>

        <hr>

        {#if currentStop}
            <div class="row">
                <Icon data={mapPin} style="width: 15px;"/> <b>{currentStop.name}</b>
            </div>
        {/if}

        {#if upcomingStop && upcomingStop != currentStop}
            <div class="row">
                <Icon data={road} style="width: 15px;"/> <b>{upcomingStop.name}</b>
            </div>
        {/if}

        {#if terminusStop && terminusStop.name != tripLabel}
            <div class="row">
                <Icon data={flag} style="width: 15px;"/> {terminusStop.name}
            </div>
        {/if}

        {#if routeType}
            <div class="row">
                <Icon data={routeType.icon} style="width: 15px;"/> {routeType.label}
            </div>
        {/if}

        {#if speedString}
            <div class="row">
                <Icon data={dashboard} style="width: 15px;"/> {speedString}
            </div>
        {/if}

        {#if trip.stopTimes.length > 0}
            <div class="stop-times-button-container">
                <Button small id="open-stop-times-dialog-button">{$_('map.vehiclePopup.openStopTimesDialog')}</Button>
            </div>
        {/if}
    </div>
{:else}
    {errorMessage}
{/if}