<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import { fetchRealtimeGtfs } from "$lib/gtfs/api";

    import { Block, Button, Dialog, ListInput, Preloader, DialogButton } from "konsta/svelte";

    let url = $settingsStore.realtimeGtfsUrl;
    let working = false;
    let error = '';

    async function onClick() {
        if (working) {return}; // make sure we're not doing this twice at the same time
        
        working = true;
        error = '';

        try {
            await fetchRealtimeGtfs(url); // attempt to fetch the feed with the provided URL

            // That was simple - everything seems to have gone fine!
            $settingsStore.realtimeGtfsUrl = url;
            working = false;
        } catch(exception) {
            // Oh oh, something failed - this shows the error dialog
            console.error(exception);

            try {
                // @ts-ignore
                error = JSON.stringify(exception.message || exception.toString());
            } catch {error = $_('generic.error')}
        }
    }
</script>

<style>
    .center {
        display: flex;
        justify-content: center;
    }

    .button {
        max-width: 350px;
    }
</style>

<ListInput label={$_('settings.realtimeGtfsFeedSetting.label')} placeholder="https://gtfs.example.com/..." type="url" value={url} onInput={function(e) {url = e.target.value.replaceAll(' ', '')}}/>

<div class="center">
    <div class="button">
        <Button disabled={working || url === '' || url === $settingsStore.realtimeGtfsUrl} {onClick}>{$_('settings.realtimeGtfsFeedSetting.set')}</Button>
    </div>
</div>

<Dialog opened={working && !error}>
    <svelte:fragment slot="title">{$_('settings.realtimeGtfsFeedSetting.dialog.title')}</svelte:fragment>
    {$_('generic.pleaseWait')} <br><br>
    
    <div class="text-center">
        <Preloader/>
    </div>
</Dialog>

<Dialog opened={working && error.length > 0} onBackdropClick={function() {working = false}}>
    <svelte:fragment slot="title">{$_('generic.error')}</svelte:fragment>
    {$_('settings.realtimeGtfsFeedSetting.dialog.errors.failed')}

    <Block strong>
        {error}
    </Block>

    <svelte:fragment slot="buttons">
        <DialogButton onClick={function() {working = false}} strong>{$_('generic.confirm')}</DialogButton>
    </svelte:fragment>
</Dialog>