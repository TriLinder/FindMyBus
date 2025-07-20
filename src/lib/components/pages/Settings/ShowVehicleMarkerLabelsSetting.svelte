<script lang="ts">
    import { _ } from "svelte-i18n";
    import { settingsStore } from "../../../../stores";

    import ToggleSettingTemplate from "./ToggleSettingTemplate.svelte";
</script>

<ToggleSettingTemplate
    label={$_('settings.showVehicleMarkerLabelsSetting.label')}
    store={settingsStore}
    storeAttribute='showVehicleMarkerLabels'
/>