<script lang="ts">;
    import { currentPageStore } from "../stores";

    import Loading from "$lib/components/pages/Loading/Loading.svelte";
    import Map from "$lib/components/pages/map/Map.svelte";
    import Settings from "$lib/components/pages/Settings/Settings.svelte";
</script>

{#if $currentPageStore === 'loading'}
    <Loading/>
{:else if $currentPageStore === 'map'}
    <Map/>
{:else if $currentPageStore === 'settings'}
    <Settings/>
{:else}
    <p>Unknown page! {$currentPageStore}</p>
{/if}