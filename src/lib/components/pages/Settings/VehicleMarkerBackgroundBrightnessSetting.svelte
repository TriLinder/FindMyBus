<script lang="ts">
    import { BlockTitle, List, ListItem, Range } from "konsta/svelte";
</script>

<style>
    .container {
        display: flex;
        gap: 15px;
        justify-content: space-between;
    }
</style>

<BlockTitle>Vehicle marker background brightness (100%)</BlockTitle>
<List strong inset>
    <ListItem>
        <svelte:fragment slot="inner">
            <div class="container">
                <span>0%</span>
                <Range min={0} max={1} step={0.01}/>
                <span>100%</span>
            </div>
        </svelte:fragment>
    </ListItem>
</List>