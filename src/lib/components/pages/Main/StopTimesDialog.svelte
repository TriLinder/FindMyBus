<script lang="ts">
    import { onMount } from "svelte";
    import { staticGtfsDataStore } from "../../../../stores";
    import type { Vehicle, Trip, Stop } from "$lib/gtfs/types";
    
    import { Dialog, Table, TableHead, TableBody, TableRow, TableCell } from "konsta/svelte";

    export let opened = false;
    export let vehicle: Vehicle;

    let trip: Trip;

    function onStopNameButtonClick(stopId: string) {
        // the fact that the stop exists is asserted by the button being
        // pressed existing in the first place
        const stop = $staticGtfsDataStore.stops[stopId];
    }

    onMount(function() {
        // Get the vehicle's trip
        if (!vehicle.tripId || !Object.keys($staticGtfsDataStore.trips).includes(vehicle.tripId)) {return;}
        trip = $staticGtfsDataStore.trips[vehicle.tripId];
    });
</script>

<style>
    .table-container {
        overflow: auto;
        height: 400px;
    }

    .stop-name-button {
        width: 120px;
    }
</style>

<div class="dialog-container">
    <Dialog {opened} onBackdropClick={function() {opened = false}}>
        {#if vehicle && trip}
            <div class="table-container">
                <Table>
                    <TableHead>
                        <TableRow header>
                            <TableCell header>Stop</TableCell> <TableCell header>Departure time</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {#each trip.stopTimes as stopTime}
                            <TableRow>
                                <TableCell>
                                    {#if Object.keys($staticGtfsDataStore.stops).includes(stopTime.stopId)}
                                        <button class="stop-name-button" on:click={function() {onStopNameButtonClick(stopTime.stopId)}}>
                                            {$staticGtfsDataStore.stops[stopTime.stopId].name}
                                        </button>
                                    {:else}
                                        Unknown stop
                                    {/if}
                                </TableCell>
                                <TableCell>{stopTime.departureTime}</TableCell>
                            </TableRow>
                        {/each}
                    </TableBody>
                </Table>
            </div>
        {:else}
            Failed to load timetable.
        {/if}
    </Dialog>
</div>