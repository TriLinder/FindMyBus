<script lang="ts">
    import { ListItem, Toggle } from "konsta/svelte";
    import type { Writable } from "svelte/store";

    export let label: string;
    export let store: Writable<Record<string, any>>;
    export let storeAttribute: string;

    function toggleValue() {
        store.update(current => ({
            ...current,
            [storeAttribute]: !current[storeAttribute]
        }));
    }
</script>

<ListItem label title={label}>
    <Toggle
        slot="media"
        checked={$store[storeAttribute]}
        onChange={toggleValue}
    />
</ListItem>