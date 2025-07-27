<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import RadioGroupSettingTemplate from "./RadioGroupSettingTemplate.svelte";

    const options = [
        {value: '12hour', label: 'settings.timeFormatSetting.12hour'},
        {value: '24hour', label: 'settings.timeFormatSetting.24hour'},
    ] as const;
</script>

<RadioGroupSettingTemplate
    blockTitle={$_('settings.timeFormatSetting.label')}
    store={settingsStore}
    storeAttribute="timeFormat"
    options={options}
/>
