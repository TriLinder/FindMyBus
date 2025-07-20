<script lang="ts" context="module">
    type StoreValue<T> = T extends Writable<infer U> ? U : never;
</script>

<script lang="ts">
    import { BlockTitle, List, ListItem, Radio } from "konsta/svelte";
    import type { Writable } from "svelte/store";

    export let blockTitle: string;
    export let store: Writable<Record<string, any>>;
    export let storeAttribute: string;
    export let options: ReadonlyArray<{ value: unknown; label: string }>;
    
    // Internal type helper
    type StoreType = StoreValue<typeof store>;
    let currentValue: StoreType[typeof storeAttribute];
    
    $: currentValue = $store[storeAttribute];
    
    function updateStore(value: unknown) {
        $store = { ...$store, [storeAttribute]: value };
    }
</script>

<BlockTitle>{blockTitle}</BlockTitle>
<List>
    {#each options as option (option.value)}
        <ListItem label title={option.label}>
            <Radio
                slot="media"
                component="div"
                value={option.value}
                checked={currentValue === option.value}
                onChange={() => updateStore(option.value)}
            />
        </ListItem>
    {/each}
</List>
