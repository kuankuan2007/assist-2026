import { createI18n } from 'vue-i18n';
import { computed, ref, watch, Ref } from 'vue';
import messages, { langs } from 'virtual:k-i18n-config:main';
import storageRef from './ref/storageRef';

export const languageName = {
  _auto: computed(
    (): string => `Auto (${languageName[browserLanguage.value as keyof typeof languageName]})`
  ),
  'zh-cn': '简体中文',
  'en-us': 'English',
};

export const languageList = ['_auto', ...langs].map((i) => ({
  id: i,
  name: languageName[i as keyof typeof languageName],
}));

const LOCALSTORAGE_KEY = '_vue_i18n_main_locale';
function getBrowserLanguage() {
  const languages = (navigator?.languages || []).map((i) => i.toLowerCase());
  const _langsOnly = langs.map((i: string) => i.split('-')[0]);
  for (const i of languages) {
    if (langs.includes(i)) {
      return i;
    }
    if (_langsOnly.includes(i)) {
      return langs[_langsOnly.indexOf(i)]!;
    }
  }
  return langs[0] || 'en-us';
}
const browserLanguage = ref(getBrowserLanguage());
export const localSettingLanguage = storageRef(LOCALSTORAGE_KEY, '_auto');
if (localSettingLanguage.value !== '_auto' && !langs.includes(localSettingLanguage.value)) {
  localSettingLanguage.value = '_auto';
}
export const language = computed({
  get: () => {
    const currentBrowserLanguage = browserLanguage.value;
    if (localSettingLanguage.value === '_auto') {
      return currentBrowserLanguage;
    }
    return localSettingLanguage.value;
  },
  set: (newValue) => {
    localSettingLanguage.value = newValue;
  },
});
watch(language, (value) => {
  (i18n.global.locale as unknown as Ref<string>).value = value;
});

export const i18n = createI18n({
  legacy: false,
  locale: language.value,
  fallbackLocale: 'en-us',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: messages as any,
});
window.addEventListener('languagechange', () => {
  browserLanguage.value = getBrowserLanguage();
});
export function t(key: string) {
  return i18n.global.t(key);
}
export function tRef(key: string) {
  return computed(() => i18n.global.t(key));
}
