<script lang="ts">
    import { _ } from "svelte-i18n";

    import { settingsStore } from "../../../../stores";

    import { BlockTitle, List, ListItem, Radio } from "konsta/svelte";

    const options: {value: 'off' | 'on' | 'system'; label: string}[] = [
        {value: 'on', label: $_('settings.darkModeSetting.on')},
        {value: 'off', label: $_('settings.darkModeSetting.off')},
        {value: 'system', label: $_('settings.darkModeSetting.system')}
    ];
</script>

<BlockTitle>{$_('settings.darkModeSetting.label')}</BlockTitle>
<List>
    {#each options as option}
        <ListItem label title={option.label}>
            <Radio slot="media" component="div" value={option.value} checked={$settingsStore.darkMode === option.value} onChange={function() {$settingsStore.darkMode = option.value}}/>
        </ListItem>
    {/each}
</List>