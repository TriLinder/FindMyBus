<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";

    import { BlockTitle, List, ListItem, Range } from "konsta/svelte";
</script>

<style>
    .container {
        display: flex;
        gap: 15px;
        justify-content: space-between;
    }
</style>

<BlockTitle>{$_('settings.vehicleMarkerBackgroundBrightnessSetting.label', {values: {value: Math.round($settingsStore.vehicleMarkerBackgroundBrightness * 100)}})}</BlockTitle>
<List strong inset>
    <ListItem>
        <svelte:fragment slot="inner">
            <div class="container">
                <span>0%</span>
                <Range 
                    min={0} max={1} step={0.01}
                    value={$settingsStore.vehicleMarkerBackgroundBrightness}
                    onChange={function(event) {$settingsStore.vehicleMarkerBackgroundBrightness = event.target.value}}
                />
                <span>100%</span>
            </div>
        </svelte:fragment>
    </ListItem>
</List>