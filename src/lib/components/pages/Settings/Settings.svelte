<script lang="ts">
    import { _ } from "svelte-i18n";
    import { currentPageStore } from "../../../../stores";

    import { Navbar, NavbarBackLink, BlockTitle, List, Button } from "konsta/svelte";

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

<style>
    .horizontal-center {
        display: flex;
        width: 100%;
        justify-content: center;
    }

    .aboutButtonContainer {
        width: 60vw;
    }

    .bottom-page-padding {
        height: 40px;
    }
</style>

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

<div class="horizontal-center">
    <div class="aboutButtonContainer">
        <Button onClick={function() {$currentPageStore = 'about'}}>{$_('about.title')}</Button>
    </div>
</div>

<div class="bottom-page-padding"></div>