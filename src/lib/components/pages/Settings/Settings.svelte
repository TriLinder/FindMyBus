<script lang="ts">
    import { _ } from "svelte-i18n";
    import { currentPageStore } from "../../../../stores";

    import { Navbar, NavbarBackLink, BlockTitle, List } from "konsta/svelte";

    import StaticGtfsFeedSetting from "./StaticGtfsFeedSetting.svelte";
    import RealtimeGtfsFeedSetting from "./RealtimeGtfsFeedSetting.svelte";
    import RealtimeGtfsFeedUpdateIntervalSetting from "./RealtimeGtfsFeedUpdateIntervalSetting.svelte";
    import LanguageSetting from "./LanguageSetting.svelte";
    import DarkModeSetting from "./DarkModeSetting.svelte";
    import ThemeSetting from "./ThemeSetting.svelte";
    import SpeedUnitsSeting from "./SpeedUnitsSeting.svelte";
    import TimeFormatSetting from "./TimeFormatSetting.svelte";
    import ShowVehicleMarkerLabelsSetting from "./ShowVehicleMarkerLabelsSetting.svelte";
    import VehicleMarkerBackgroundBrightnessSetting from "./VehicleMarkerBackgroundBrightnessSetting.svelte";
</script>

<Navbar title={$_('settings.title')}>
    <NavbarBackLink slot="left" text="Back" onClick={function() {$currentPageStore = 'main'}} />
</Navbar> 

<BlockTitle medium>{$_('settings.gtfsFeed')}</BlockTitle>
<List strong inset>
    <StaticGtfsFeedSetting/>
    <RealtimeGtfsFeedSetting/>
    <RealtimeGtfsFeedUpdateIntervalSetting/>
</List>

<BlockTitle medium>{$_('settings.visual')}</BlockTitle>
<List strong inset>
    <LanguageSetting/>
    <DarkModeSetting/>
    <ThemeSetting/>
    <SpeedUnitsSeting/>
    <TimeFormatSetting/>
    <ShowVehicleMarkerLabelsSetting/>
    <VehicleMarkerBackgroundBrightnessSetting/>
</List>