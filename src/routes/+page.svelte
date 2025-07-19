<script lang="ts">;
    import "../app.css";
    import "@fontsource/roboto";
    import { currentPageStore } from "../stores";

    import iconUrl from "$lib/assets/icon.svg";

    import { App, Page } from "konsta/svelte";
    import Loading from "$lib/components/pages/Loading/Loading.svelte";
    import Main from "$lib/components/pages/Main/Main.svelte";
    import Settings from "$lib/components/pages/Settings/Settings.svelte";
</script>

<svelte:head>
    <title>FindMyBus</title>
    <link rel="icon" href={iconUrl} />
</svelte:head>

<App theme="material" dark={false}>
    <Page>
        {#if $currentPageStore === 'loading'}
            <Loading/>
        {:else if $currentPageStore === 'main'}
            <Main/>
        {:else if $currentPageStore === 'settings'}
            <Settings/>
        {:else}
            <p>Unknown page! {$currentPageStore}</p>
        {/if}
    </Page>
</App>