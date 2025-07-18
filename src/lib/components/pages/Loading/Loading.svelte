<script lang="ts">
    import { onMount } from "svelte";
    import { initI18n } from "$lib/i18n";
    import { staticGtfsDataStore, mapPositionStore, currentPageStore } from "../../../../stores";

    async function load() {
        // Wait for the persistent stores
        // to initialize
        await staticGtfsDataStore.init();
        await mapPositionStore.init();

        // Wait for i18n to initialize
        await initI18n();

        // Done! :D
        $currentPageStore = 'map';
    }

    onMount(load);
</script>

loading..