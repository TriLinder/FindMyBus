<script lang="ts">;
    import { currentPageStore } from "../stores";

    import Loading from "$lib/components/pages/Loading/Loading.svelte";
    import Map from "$lib/components/pages/map/Map.svelte";
</script>

{#if $currentPageStore === 'loading'}
    <Loading/>
{:else if $currentPageStore === 'map'}
    <Map/>
{:else}
    <p>Unknown page! {$currentPageStore}</p>
{/if}