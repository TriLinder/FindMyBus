<script lang="ts">
    import { _ } from "svelte-i18n";

    import { settingsStore } from "../../../../stores";

    import { BlockTitle, List, ListItem, Radio } from "konsta/svelte";

    const languages: {value: 'en' | 'cs'; label: string}[] = [
        {value: 'en', label: 'English'},
        {value: 'cs', label: 'Czech'}
    ];
</script>

<BlockTitle>{$_('settings.languageSettingSetting.label')}</BlockTitle>
<List>
    {#each languages as language}
        <ListItem label title={language.label}>
            <Radio slot="media" component="div" value={language.value} checked={$settingsStore.language === language.value} onChange={function() {$settingsStore.language = language.value}}/>
        </ListItem>
    {/each}
</List>