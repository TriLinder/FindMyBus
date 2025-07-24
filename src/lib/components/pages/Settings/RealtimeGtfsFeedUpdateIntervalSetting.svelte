<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    
    import { Stepper, ListItem } from "konsta/svelte";

    function onPlus() {
        $settingsStore.realtimeGtfsUpdateInterval += 1;
    }

    function onMinus() {
        if ($settingsStore.realtimeGtfsUpdateInterval > 2) {
            $settingsStore.realtimeGtfsUpdateInterval -= 1;
        }
    }
</script>

<ListItem title={$_('settings.realtimeGtfsUpdateIntervalSetting.label', {values: {value: $settingsStore.realtimeGtfsUpdateInterval}})}>
    <Stepper slot="after" value={$settingsStore.realtimeGtfsUpdateInterval} buttonsOnly {onPlus} {onMinus}/>
</ListItem>