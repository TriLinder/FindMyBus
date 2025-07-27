<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { App } from "@capacitor/app";
    
    import { currentPageStore } from "../../../../stores";

    import { Block, Navbar, NavbarBackLink, Link, Button } from "konsta/svelte";

    const isPrideMonth = (new Date().getMonth() + 1) == 6; // June, the sixth month, is pride month
    let appVersion: string | undefined = undefined;

    onMount(async function() {
        try {
            const appInfo = await App.getInfo();
            appVersion = `${appInfo.version}-${appInfo.build}`;
        } catch {
            console.warn("Failed to load app version");
        }
    });
</script>

<style>
    .page-center {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100vw;
        height: 100vh;
        overflow: hidden;

        position: absolute;
        left: 0;
        top: 0;
    }

    h1 {
        font-size: 42px;
        font-weight: bold;
        padding: 20px;
    }

    .pride-title {
        background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20777%20480%22%3E %20%20%3Cpath%20fill%3D%22%23770088%22%20d%3D%22M0%200h777v480H0z%22%2F%3E %20%20%3Cpath%20fill%3D%22%23004CFF%22%20d%3D%22M0%200h777v400H0z%22%2F%3E %20%20%3Cpath%20fill%3D%22%23028121%22%20d%3D%22M0%200h777v320H0z%22%2F%3E %20%20%3Cpath%20fill%3D%22%23FFEE00%22%20d%3D%22M0%200h777v240H0z%22%2F%3E %20%20%3Cpath%20fill%3D%22%23FF8D00%22%20d%3D%22M0%200h777v160H0z%22%2F%3E %20%20%3Cpath%20fill%3D%22%23E50000%22%20d%3D%22M0%200h777v80H0z%22%2F%3E %3C%2Fsvg%3E");
        background-repeat: repeat-x;
        background-position: right;
        color: black;
    }

    .center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<Navbar title={$_('about.title')}>
    <NavbarBackLink slot="left" text="Back" onClick={function() {$currentPageStore = 'settings'}} />
</Navbar> 

<div class="page-center">
    <div class="content">
        <Block strong inset>
            <h1 class:pride-title={isPrideMonth}>FindMyBus</h1>
        </Block>

        <Block strong inset>
            <div class="center">
                <Link href="https://jakubhlavacek.com" target="_blank">{$_('about.links.myHomepage')}</Link>
                <Link href="https://github.com/TriLinder/FindMyBus" target="_blank">{$_('about.links.sourceCode')}</Link>
            </div>
        </Block>

        <Block>
            <div class="center">
                {#if appVersion}
                    {$_('about.version', {values: {value: appVersion}})}
                {/if}

                <Button onClick={function() {$currentPageStore = 'dependencyAcknowledgments'}}>{$_('dependencyAcknowledgments.title')}</Button>
            </div>
        </Block>
    </div>
</div>