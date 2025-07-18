import { init, register } from 'svelte-i18n';

export async function initI18n() {
    register('en', () => import('./locales/en.json'));

    await init({
        initialLocale: "en",
        fallbackLocale: "en"
    });
}