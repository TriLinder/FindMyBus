<script lang="ts">;
    import { currentPageStore } from "../stores";

    import Map from "$lib/components/pages/map/Map.svelte";
</script>

{#if $currentPageStore == 'map'}
    <Map/>
{:else}
    <p>Unknown page! {$currentPageStore}</p>
{/if}