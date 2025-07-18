<script lang="ts">
    import { onMount } from "svelte";
    import { staticGtfsDataStore, mapPositionStore, currentPageStore } from "../../../../stores";

    async function load() {
        // Wait for the persistent stores
        // to initialize
        await staticGtfsDataStore.init();
        await mapPositionStore.init();

        // Done! :D
        $currentPageStore = 'map';
    }

    onMount(load);
</script>

loading..