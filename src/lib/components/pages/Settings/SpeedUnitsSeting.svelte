<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import RadioGroupSettingTemplate from "./RadioGroupSettingTemplate.svelte";

    const options = [
        {value: 'kilometersPerHour', label: 'settings.speedUnitsSetting.kilometersPerHour'},
        {value: 'milesPerHour', label: 'settings.speedUnitsSetting.milesPerHour'},
        {value: 'metersPerSecond', label: 'settings.speedUnitsSetting.metersPerSecond'},
        {value: 'knots', label: 'settings.speedUnitsSetting.knots'},
        {value: 'feetPerDay', label: 'settings.speedUnitsSetting.feetPerDay'},        
    ] as const;
</script>

<RadioGroupSettingTemplate
    blockTitle={$_('settings.speedUnitsSetting.label')}
    store={settingsStore}
    storeAttribute="speedUnits"
    options={options}
/>
