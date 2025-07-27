<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import RadioGroupSettingTemplate from "./RadioGroupSettingTemplate.svelte";

    const options = [
        {value: 'kmph', label: 'settings.speedUnitsSetting.kmph'},
        {value: 'mph', label: 'settings.speedUnitsSetting.mph'},
        {value: 'mps', label: 'settings.speedUnitsSetting.mps'}
    ] as const;
</script>

<RadioGroupSettingTemplate
    blockTitle={$_('settings.speedUnitsSetting.label')}
    store={settingsStore}
    storeAttribute="speedUnits"
    options={options}
/>
