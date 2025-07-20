<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import { fetchStaticGtfs } from "$lib/gtfs/api";

    import { Block, Button, Dialog, DialogButton, ListInput, Preloader } from "konsta/svelte";

    let url = $settingsStore.staticGtfsUrl;
    let working = false;
    let error = '';

    async function onClick() {
        if (working) {return}; // make sure we're not doing this twice at the same time
        
        working = true;

        try {
            await fetchStaticGtfs(url); // attempt to fetch the feed with the provided URL

            // That was simple - everything seems to have gone fine!
            $settingsStore.staticGtfsUrl = url;
            working = false;
        } catch(exception) {
            // Oh oh, something failed - this shows the error dialog
            console.error(exception);
            error = JSON.stringify(exception);
        }
    }
</script>

<ListInput label={$_('settings.staticGtfsFeedSetting.label')} placeholder="https://gtfs.example.com/..." type="text" value={url} onInput={function(e) {url = e.target.value.replaceAll(' ', '')}}/>
<Button disabled={working || url === ''} {onClick}>
    {#if url === $settingsStore.staticGtfsUrl && url != ''}
        {$_('settings.staticGtfsFeedSetting.refresh')}
    {:else}
        {$_('settings.staticGtfsFeedSetting.set')}
    {/if}
</Button>

<Dialog opened={working && !error}>
    <svelte:fragment slot="title">{$_('settings.staticGtfsFeedSetting.dialog.title')}</svelte:fragment>
    {$_('generic.pleaseWait')} <br><br>
    
    <div class="text-center">
        <Preloader/>
    </div>
</Dialog>

<Dialog opened={working && error.length > 0} onBackdropClick={function() {working = false}}>
    <svelte:fragment slot="title">{$_('generic.error')}</svelte:fragment>
    {$_('settings.staticGtfsFeedSetting.dialog.errors.failed')}

    <Block strong>
        {error}
    </Block>

    <svelte:fragment slot="buttons">
        <DialogButton onClick={function() {working = false}} strong>{$_('generic.confirm')}</DialogButton>
    </svelte:fragment>
</Dialog>



























