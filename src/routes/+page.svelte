<script lang="ts">;
    import "../app.css";
    import "@fontsource/roboto";
    import { currentPageStore, settingsStore } from "../stores";

    import iconUrl from "$lib/assets/icon.svg";

    import { App, Page } from "konsta/svelte";
    import Loading from "$lib/components/pages/Loading/Loading.svelte";
    import Main from "$lib/components/pages/Main/Main.svelte";
    import Onboarding from "$lib/components/pages/Onboarding/Onboarding.svelte";
    import Settings from "$lib/components/pages/Settings/Settings.svelte";

    const systemPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    $: useDarkMode = ($settingsStore.darkMode === 'on') || ($settingsStore.darkMode === 'system' && systemPrefersDarkMode);
</script>

<svelte:head>
    <title>FindMyBus</title>
    <link rel="icon" href={iconUrl} />
</svelte:head>

{#if $currentPageStore === 'loading'}
    <Loading/>
{/if}

{#key [useDarkMode, $settingsStore.theme]}
    <App theme={$settingsStore.theme} safeAreas dark={useDarkMode}>
        <Page>
            {#if $currentPageStore === 'main'}
                <Main/>
            {:else if $currentPageStore === 'onboarding'}
                <Onboarding/>
            {:else if $currentPageStore === 'settings'}
                <Settings/>
            {:else}
                <p style="color: red;">Unknown page! {$currentPageStore}</p>
            {/if}
        </Page>
    </App>
{/key}