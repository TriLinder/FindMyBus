<script lang="ts">
    import { _ } from "svelte-i18n";

    import { Block, List } from "konsta/svelte";
    import StaticGtfsFeedSetting from "../Settings/StaticGtfsFeedSetting.svelte";
</script>

<style>
    h1 {
        color: black;
        margin-top: 15px;
        text-align: center;
        font-size: 32px;
        font-weight: bold;
    }
</style>

<h1>{$_('forceStaticGtfsUpdate.title')}</h1>

<Block strong inset>
    {@html $_('forceStaticGtfsUpdate.text')}
</Block>

<List>
    <StaticGtfsFeedSetting/>
</List>