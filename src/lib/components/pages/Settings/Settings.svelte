<script lang="ts">
    import { _ } from "svelte-i18n";

    import { Navbar, Block, BlockTitle, List } from "konsta/svelte";

    import StaticGtfsFeedSetting from "./StaticGtfsFeedSetting.svelte";
    import RealtimeGtfsFeedSetting from "./RealtimeGtfsFeedSetting.svelte";
    import LanguageSetting from "./LanguageSetting.svelte";
    import DarkModeSetting from "./DarkModeSetting.svelte";
    import SpeedUnitsSeting from "./SpeedUnitsSeting.svelte";
    import TimeFormatSetting from "./TimeFormatSetting.svelte";
</script>

<Navbar title={$_('settings.title')}/> 

<BlockTitle medium>{$_('settings.gtfsFeed')}</BlockTitle>
<List strong>
    <StaticGtfsFeedSetting/>
    <RealtimeGtfsFeedSetting/>
</List>

<BlockTitle medium>{$_('settings.visual')}</BlockTitle>
<List strong>
    <LanguageSetting/>
    <DarkModeSetting/>
    <SpeedUnitsSeting/>
    <TimeFormatSetting/>
</List>