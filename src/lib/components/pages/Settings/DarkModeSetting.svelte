<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import RadioGroupSettingTemplate from "./RadioGroupSettingTemplate.svelte";

    const options = [
        {value: 'on', label: $_('settings.darkModeSetting.on')},
        {value: 'off', label: $_('settings.darkModeSetting.off')},
        {value: 'system', label: $_('settings.darkModeSetting.system')}
    ] as const;
</script>

<RadioGroupSettingTemplate
    blockTitle={$_('settings.darkModeSetting.label')}
    store={settingsStore}
    storeAttribute="darkMode"
    options={options}
/>
