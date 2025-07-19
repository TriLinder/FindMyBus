<script lang="ts">
    import { currentPageStore } from "../../../../stores";
    import { fetchStaticGtfs, fetchRealtimeGtfs } from "$lib/gtfs/api";

    import Map from "./Map.svelte";
</script>

<style>
    .map-container {
        width: 1000px;
        height: 500px;
    }

    button {
        color: blue;
    }
</style>

<div class="map-container">
    <Map/>
</div>

<br> <button on:click={function() {fetchStaticGtfs('http://localhost:8000/gtfs.zip')}}>Update static</button>
<br> <button on:click={function() {fetchRealtimeGtfs('http://localhost:8000/gtfsReal.dat')}}>Update realtime</button>
<br> <button on:click={function() {$currentPageStore = 'settings'}}>Settings</button>