<script lang="ts">
    import { _ } from "svelte-i18n";

    import { Navbar, Block, BlockTitle, List } from "konsta/svelte";

    import StaticGtfsFeedSetting from "./StaticGtfsFeedSetting.svelte";
    import RealtimeGtfsFeedSetting from "./RealtimeGtfsFeedSetting.svelte";
</script>

<Navbar title={$_('settings.title')}/> 
<BlockTitle medium>{$_('settings.gtfsFeed')}</BlockTitle>

<List strong>
    <StaticGtfsFeedSetting/>
    <RealtimeGtfsFeedSetting/>
</List>