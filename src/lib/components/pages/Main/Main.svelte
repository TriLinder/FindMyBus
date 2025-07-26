<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onMount, onDestroy } from "svelte";

    import { currentPageStore, realtimeGtfsDataStore, settingsStore } from "../../../../stores";
    import { fetchRealtimeGtfs } from "$lib/gtfs/api";

    import { Link, Navbar } from "konsta/svelte";
    import Icon from "svelte-awesome";
    import gear from 'svelte-awesome/icons/gear';
    import refresh from 'svelte-awesome/icons/refresh';
    
    import Map from "./Map.svelte";

    let realtimeFeedAgeSeconds = 0;
    let lastFetchAttemptTimestamp = 0;
    let fetchingState: 'ok' | 'fetching' | 'error' = 'ok';

    let updateInterval: ReturnType<typeof setInterval>;

    async function fetch() {
        try {
            fetchingState = 'fetching';
            lastFetchAttemptTimestamp = Date.now();
            await fetchRealtimeGtfs($settingsStore.realtimeGtfsUrl);
            fetchingState = 'ok';
        } catch {
            fetchingState = 'error';
        }
    }

    async function update() {
        // If the realtime feed is older than the
        // update interval, it's time to fetch it again.
        realtimeFeedAgeSeconds = (Date.now() - new Date($realtimeGtfsDataStore.localTimestamp).getTime()) / 1000;
        if ((realtimeFeedAgeSeconds > $settingsStore.realtimeGtfsUpdateInterval) &&
            ((fetchingState === 'ok') || (fetchingState === 'error' && (Date.now() - lastFetchAttemptTimestamp > 10*1000)))
        ) {
            await fetch();
        }
    }

    onMount(function() {
        updateInterval = setInterval(update, 100);
    });

    onDestroy(function() {
        clearInterval(updateInterval);
    });
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }

    .map-container {
        width: 100%;
        height: 100%;
        flex: 1;
    }
</style>

<div class="content">
    <Navbar title={$_('main.title')}>
        <!-- settings button -->
        <Link navbar iconOnly slot="left" onClick={function() {$currentPageStore = 'settings'}}>
            <Icon data={gear}/>
        </Link>

        <!-- refresh button -->
        <Link navbar iconOnly slot="right" onClick={function() {if (fetchingState != 'fetching') {fetch()}}}>
            <Icon data={refresh}/>
        </Link>

        <div class="infobar" slot="subtitle">
            <span>
                {#if fetchingState === 'ok'}
                    {$_('main.infobar.lastRefreshed', {values: {value: Math.round(realtimeFeedAgeSeconds)}})}
                {:else if fetchingState === 'fetching'}
                    {$_('main.infobar.fetching')}
                {:else if fetchingState === 'error'}
                    {$_('main.infobar.error')}
                {/if}
            </span>
        </div>
    </Navbar>

    <div class="map-container">
        <Map/>
    </div>
</div>