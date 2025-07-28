<script lang="ts">;
    import "../app.css";
    import "@fontsource/roboto";
    import { onMount } from "svelte";
    import { currentPageStore, settingsStore } from "../stores";
    import { App as CapacitorApp } from "@capacitor/app";

    import iconUrl from "$lib/assets/icon.svg";

    import { App, Page } from "konsta/svelte";
    import Loading from "$lib/components/pages/Loading/Loading.svelte";
    import Main from "$lib/components/pages/Main/Main.svelte";
    import Onboarding from "$lib/components/pages/Onboarding/Onboarding.svelte";
    import ForceStaticGtfsUpdate from "$lib/components/pages/ForceStaticGtfsUpdate/ForceStaticGtfsUpdate.svelte";
    import Settings from "$lib/components/pages/Settings/Settings.svelte";
    import About from "$lib/components/pages/About/About.svelte";
    import DependencyAcknowledgments from "$lib/components/pages/DependencyAcknowledgments/DependencyAcknowledgments.svelte";

    const introductoryPages: (typeof $currentPageStore)[] = ['loading', 'onboarding', 'forceStaticGtfsUpdate', 'main'];

    const systemPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    $: useDarkMode = ($settingsStore.darkMode === 'on') || ($settingsStore.darkMode === 'system' && systemPrefersDarkMode);
    $: theme = $settingsStore.theme;

    function goBack() {
        // The page history system in this app is incredibly simple (at least for now).
        // When you press the back button, unless you're on one of the introductory pages,
        // you go back to the main page. And if you ware on one of the introductory pages,
        // you quit the app.
        if (!introductoryPages.includes($currentPageStore)) {
            $currentPageStore = 'main';
        } else {
            CapacitorApp.exitApp();
        }
    }

    onMount(function() {
        CapacitorApp.addListener('backButton', goBack);
    });
</script>

<style>
    .ios-lightmode {
        color: black;
    }
</style>

<svelte:head>
    <title>FindMyBus</title>
    <link rel="icon" href={iconUrl} />
</svelte:head>

{#if $currentPageStore === 'loading'}
    <Loading/>
{/if}

{#key [useDarkMode, theme]}
    <div class:ios-lightmode={!useDarkMode && theme === 'ios'}>
        <App {theme} safeAreas dark={useDarkMode}>
            <Page>
                {#if $currentPageStore === 'main'}
                    <Main/>
                {:else if $currentPageStore === 'onboarding'}
                    <Onboarding/>
                {:else if $currentPageStore === 'forceStaticGtfsUpdate'}
                    <ForceStaticGtfsUpdate/>
                {:else if $currentPageStore === 'settings'}
                    <Settings/>
                {:else if $currentPageStore === 'about'}
                    <About/>
                {:else if $currentPageStore === 'dependencyAcknowledgments'}
                    <DependencyAcknowledgments/>
                {:else}
                    <p style="color: red;">Unknown page! {$currentPageStore}</p>
                {/if}
            </Page>
        </App>
    </div>
{/key}