import { init, locale, register } from 'svelte-i18n';
import { settingsStore } from '../../stores';
import { get } from 'svelte/store';

export async function initI18n() {
    register('en', () => import('./locales/en.json'));

    await init({
        initialLocale: get(settingsStore).language,
        fallbackLocale: 'en'
    });

    // Update the locale
    settingsStore.subscribe(function(value) {
        locale.set(value.language);
    });
}