<script lang="ts">
    import type { Vehicle } from "$lib/gtfs/types";
    import { Dialog } from "konsta/svelte";

    export let opened = false;
    export let vehicle: Vehicle;
</script>

<Dialog {opened}>
    {#if vehicle}
        {vehicle.id}
    {:else}
        no vehicle
    {/if}
</Dialog>