import { createI18n, I18n } from 'vue-i18n';
import { computed, ref, watch, type Ref } from 'vue';
import storageRef from './ref/storageRef';

function getBrowserLanguage() {
  return (navigator?.languages || [navigator.language]).map((i) => i.toLowerCase());
}

const browserLanguageSetting = ref<string[]>(getBrowserLanguage());
window.addEventListener('languagechange', () => {
  browserLanguageSetting.value = getBrowserLanguage();
});

function getBrowserLanguageInLangs(langs: string[]) {
  const languages = browserLanguageSetting.value;
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
const languageNameMapPreset = {
  'zh-tw': '繁体中文',
  'zh-cn': '简体中文',
  'en-us': 'English',
};
export default class I18nInstance {
  private readonly localSettingLanguage: Ref<string>;
  private readonly browserLanguage: Ref<string>;

  public readonly languageList: { name: Ref<string>; id: string }[];
  public readonly language: Ref<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly i18n: I18n<any, Record<string, unknown>, Record<string, unknown>, string, false>;

  constructor(
    public readonly messages: unknown,
    public readonly langs: string[],
    private readonly storageKey: string = '_vue_i18n_main_locale',
    public readonly languageNameMap: Record<string, string> = languageNameMapPreset
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const now = this;
    this.languageList = ['_auto', ...langs].map((i) => ({
      id: i,
      name: this.languageName(i),
    }));
    this.localSettingLanguage = storageRef(this.storageKey, '_auto');
    this.browserLanguage = computed(() => getBrowserLanguageInLangs(browserLanguageSetting.value));
    this.language = computed({
      get() {
        const currentBrowserLanguage = now.browserLanguage.value;
        if (
          now.localSettingLanguage.value !== '_auto' &&
          !now.langs.includes(now.localSettingLanguage.value)
        ) {
          now.localSettingLanguage.value = '_auto';
        }
        if (now.localSettingLanguage.value === '_auto') {
          return currentBrowserLanguage;
        }
        return now.localSettingLanguage.value;
      },
      set(newValue) {
        now.localSettingLanguage.value = newValue;
      },
    });
    this.i18n = createI18n({
      legacy: false,
      locale: this.language.value,
      fallbackLocale: 'en-us',
      messages: this.messages as never,
    });
    watch(
      () => now.language.value,
      (newValue) => {
        now.i18n.global.locale.value = newValue;
      }
    );
  }
  t(key: string) {
    return this.i18n.global.t(key);
  }
  tRef(key: string) {
    return computed(() => this.t(key));
  }
  languageName(lan: string) {
    if (lan === '_auto') {
      return computed((): string => `Auto-${this.languageName(this.browserLanguage.value).value}`);
    }
    if (lan in this.languageNameMap) {
      return ref(this.languageNameMap[lan]);
    }
    return ref(new Intl.DisplayNames([lan], { type: 'language' }).of(lan) || lan);
  }
}
