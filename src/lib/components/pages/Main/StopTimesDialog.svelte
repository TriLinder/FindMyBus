<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    
    import { parseStopTimeStringToLocalTimezoneToday, dateToTimeString } from "$lib/utils";
    import { staticGtfsDataStore } from "../../../../stores";
    import { getStopTimesForTrip } from "$lib/gtfs/get";
    
    import type { Writable } from "svelte/store";
    import type { Vehicle, Trip, Stop, StopTimes } from "$lib/gtfs/types";
    
    import { Dialog, Table, TableHead, TableBody, TableRow, TableCell } from "konsta/svelte";

    export let opened: Writable<boolean>;
    export let vehicle: Vehicle;
    export let onStopClick: ((arg: Stop) => any) | null = null;

    let stopTimes: StopTimes;

    function onStopNameButtonClick(stopId: string) {
        // the fact that the stop exists is asserted by the button being
        // pressed existing in the first place
        const stop = $staticGtfsDataStore.stops[stopId];

        if (!onStopClick) {return};
        onStopClick(stop);
    }

    onMount(async function() {
        // Get the trip's stop times
        if (!vehicle.tripId) {return};
        stopTimes = await getStopTimesForTrip(vehicle.tripId);
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

    .past-stop-name {
        color: gray;
    }
</style>

<div class="dialog-container">
    <Dialog opened={$opened} onBackdropClick={function() {$opened = false}}>
        {#if vehicle && stopTimes}
            <div class="table-container">
                <Table>
                    <TableHead>
                        <TableRow header>
                            <TableCell header>{$_('map.stopTimesDialog.stop')}</TableCell> <TableCell header>{$_('map.stopTimesDialog.departureTime')}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {#each stopTimes as stopTime}
                            <TableRow>
                                <TableCell>
                                    {#if Object.keys($staticGtfsDataStore.stops).includes(stopTime.stopId)}
                                        <button 
                                            class="stop-name-button"
                                            on:click={function() {onStopNameButtonClick(stopTime.stopId)}}
                                            class:past-stop-name={Date.now() > parseStopTimeStringToLocalTimezoneToday(stopTime.departureTime).getTime()}>
                                                {$staticGtfsDataStore.stops[stopTime.stopId].name}
                                        </button>
                                    {:else}
                                        {$_('map.stopTimesDialog.unknownStop')}
                                    {/if}
                                </TableCell>
                                <TableCell>{dateToTimeString(parseStopTimeStringToLocalTimezoneToday(stopTime.departureTime))}</TableCell>
                            </TableRow>
                        {/each}
                    </TableBody>
                </Table>
            </div>
        {:else}
            {$_('map.stopTimesDialog.errors.failedToLoad')}
        {/if}
    </Dialog>
</div>