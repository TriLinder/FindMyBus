<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    
    import { ListInput, Button } from "konsta/svelte";

    const defaultUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let url = $settingsStore.mapSourceUrl;
</script>

<style>
    .center {
        display: flex;
        justify-content: center;
    }

    .buttons {
        display: flex;
        gap: 15px;
    }
</style>

<ListInput 
    label={$_('settings.mapSourceUrl.label')} 
    placeholder="https://tile.openstreetmap.org/..." 
    type="text"
    value={url}
    onInput={function(e) {url = e.target.value.replaceAll(' ', '')}}
/>

<div class="center">
    <div class="buttons">
        <Button disabled={url === defaultUrl} onClick={function() {url = defaultUrl; $settingsStore.mapSourceUrl = defaultUrl}}>{$_('settings.mapSourceUrl.reset')}</Button>
        <Button disabled={$settingsStore.mapSourceUrl === url} onClick={function() {$settingsStore.mapSourceUrl = url}}>{$_('settings.mapSourceUrl.set')}</Button>
    </div>
</div>