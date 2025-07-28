<script lang="ts">
    import { onMount } from "svelte";
    import { initI18n } from "$lib/i18n";
    import { settingsStore, staticGtfsDataStore, mapPositionStore, currentPageStore, finishedInteractionsStore } from "../../../../stores";
    import { fetchRealtimeGtfs } from "$lib/gtfs/api";

    import iconUrl from "$lib/assets/icon.svg";

    async function load() {
        // Wait for the persistent stores
        // to initialize
        await settingsStore.init();
        if ($settingsStore.realtimeGtfsUrl) {fetchRealtimeGtfs($settingsStore.realtimeGtfsUrl)}; // begin fetching the realtime feed while we wait here
        await staticGtfsDataStore.init();
        await mapPositionStore.init();
        await finishedInteractionsStore.init();

        // Wait for i18n to initialize
        await initI18n();

        // Done! 🎉
        if (!$finishedInteractionsStore.includes('onboarding')) {
            $currentPageStore = 'onboarding';
        } else {
            $currentPageStore = 'forceStaticGtfsUpdate';
        }
    }

    onMount(load);
</script>

<style>
    :global(body) {
        overflow: hidden;
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        width: 100vw;
        height: 100vh;

        background-color: black;
        user-select: none;
        pointer-events: none;
    }

    img {
        width: 20vw;
    }
</style>

<div class="content">
    <img src={iconUrl} alt="Loading icon">
</div>