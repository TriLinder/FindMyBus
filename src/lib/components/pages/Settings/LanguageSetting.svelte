<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";
    import RadioGroupSettingTemplate from "./RadioGroupSettingTemplate.svelte";

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'cs', label: 'Czech' }
    ] as const;
</script>

<RadioGroupSettingTemplate
    blockTitle={$_('settings.languageSettingSetting.label')}
    store={settingsStore}
    storeAttribute="language"
    options={languages}
/>
