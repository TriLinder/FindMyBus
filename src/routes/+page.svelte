<script lang="ts">;
    import { getStaticGtfs } from "$lib/gtfs/api";

    let url: string;

    async function click() {
        await getStaticGtfs(url);
    }
</script>

<input type="text" bind:value={url}>
<button on:click={click}>GET</button>