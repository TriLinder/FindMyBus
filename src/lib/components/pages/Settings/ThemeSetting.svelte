<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import RadioGroupSettingTemplate from "./RadioGroupSettingTemplate.svelte";

    const options = [
        {value: 'material', label: $_('settings.themeSetting.material')},
        {value: 'ios', label: $_('settings.themeSetting.ios')}
    ] as const;
</script>

<RadioGroupSettingTemplate
    blockTitle={$_('settings.themeSetting.label')}
    store={settingsStore}
    storeAttribute="theme"
    options={options}
/>
