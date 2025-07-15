<script lang="ts">;
    import { getStaticGtfs, getRealtimeGtfs } from "$lib/gtfs/api";

    let type: 'static' | 'realtime' = "realtime";
    let url: string;

    async function click() {
        if (type === 'static') {
            await getStaticGtfs(url);
        } else {
            await getRealtimeGtfs(url);
        }
    }
</script>

<input type="radio" bind:group={type} value="static"> Static
<input type="radio" bind:group={type} value="realtime" checked> Realtime
<input type="text" bind:value={url}>
<button on:click={click}>GET {type}</button>