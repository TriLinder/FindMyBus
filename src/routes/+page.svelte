<script lang="ts">;
    import { currentPageStore } from "../stores";

    import iconUrl from "$lib/assets/icon.svg";

    import Loading from "$lib/components/pages/Loading/Loading.svelte";
    import Main from "$lib/components/pages/Main/Main.svelte";
    import Settings from "$lib/components/pages/Settings/Settings.svelte";
</script>

<svelte:head>
    <title>FindMyBus</title>
    <link rel="icon" href={iconUrl} />
</svelte:head>

{#if $currentPageStore === 'loading'}
    <Loading/>
{:else if $currentPageStore === 'main'}
    <Main/>
{:else if $currentPageStore === 'settings'}
    <Settings/>
{:else}
    <p>Unknown page! {$currentPageStore}</p>
{/if}