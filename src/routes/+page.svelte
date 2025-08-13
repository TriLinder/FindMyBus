<script lang="ts">;
    import "../app.css";
    import "@fontsource/roboto";

    import { onMount } from "svelte";
    import { SafeArea } from '@capacitor-community/safe-area';
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
    const ignoreSafeAreaPages: (typeof $currentPageStore)[] = ['loading', 'onboarding', 'forceStaticGtfsUpdate'];

    const systemPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    $: useDarkMode = ($settingsStore.darkMode === 'on') || ($settingsStore.darkMode === 'system' && systemPrefersDarkMode);
    $: theme = $settingsStore.theme;
    // the safe area padding color should match the Navbar colors on each page
    // and we pick them based on the theme and dark mode
    $: safeAreaPaddingColor = {'material-false': 'red', 'material-true': '#272931', 'ios-false': '#f6f6f7', 'ios-true': '#0e0e0e'}[`${theme}-${useDarkMode}`];

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
        SafeArea.enable({
            config: {
                customColorsForSystemBars: true,
                statusBarColor: '#00000000', // transparent
                statusBarContent: 'light',
                navigationBarColor: '#00000000', // transparent
                navigationBarContent: 'light',
            }
        });

        CapacitorApp.addListener('backButton', goBack);
    });
</script>

<style>
    .ios-lightmode {
        color: black;
    }

    /* we handle safe areas ourselves, as even though KonstaUI should theoretically
       be able to do it on its own, i've found it to be weirldy inconsisnet (that's
       verry possibly on me though of course) */
    .safe-areas {
        padding-top: var(--safe-area-inset-top);
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
    <div class:ios-lightmode={!useDarkMode && theme === 'ios'} class:safe-areas={!ignoreSafeAreaPages.includes($currentPageStore)} style:background-color={safeAreaPaddingColor}>
        <App {theme} safeAreas={false} dark={useDarkMode}>
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