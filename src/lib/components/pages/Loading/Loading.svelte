<script lang="ts">
    import { onMount } from "svelte";
    import { initI18n } from "$lib/i18n";
    import { settingsStore, staticGtfsDataStore, mapPositionStore, currentPageStore } from "../../../../stores";
    import { fetchRealtimeGtfs } from "$lib/gtfs/api";

    async function load() {
        // Wait for the persistent stores
        // to initialize
        await settingsStore.init();
        if ($settingsStore.realtimeGtfsUrl) {fetchRealtimeGtfs($settingsStore.realtimeGtfsUrl)}; // begin fetching the realtime feed while we wait here
        await staticGtfsDataStore.init();
        await mapPositionStore.init();

        // Wait for i18n to initialize
        await initI18n();

        // Done! :D
        $currentPageStore = 'main';
    }

    onMount(load);
</script>

loading..