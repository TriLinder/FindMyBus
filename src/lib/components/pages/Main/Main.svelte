<script lang="ts">
    import { _ } from "svelte-i18n";
    import { currentPageStore } from "../../../../stores";
    import { fetchStaticGtfs, fetchRealtimeGtfs } from "$lib/gtfs/api";

    import { Link, Navbar } from "konsta/svelte";
    import Icon from "svelte-awesome";
    import gear from 'svelte-awesome/icons/gear';
    import refresh from 'svelte-awesome/icons/refresh';
    
    import Map from "./Map.svelte";
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
        <Link navbar iconOnly slot="right">
            <Icon data={refresh}/>
        </Link>

        <div class="infobar" slot="subtitle">
            <span>Last refreshed YY seconds ago.</span>
        </div>
    </Navbar>

    <div class="map-container">
        <Map/>
    </div>
</div>