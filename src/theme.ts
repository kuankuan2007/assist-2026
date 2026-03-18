import storageRef from './ref/storageRef';
import mediaRef from './ref/mediaRef';
import { computed, watch } from 'vue';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export const themeValueList = [Theme.Auto, Theme.Light, Theme.Dark] as const;

export const themeValue = storageRef<Theme>('theme', 'auto', localStorage);
const matcherRef = mediaRef(window.matchMedia('(prefers-color-scheme: dark)'));

export const theme = computed(() => {
  const systemTheme = matcherRef.value ? Theme.Dark : Theme.Light;
  if (!themeValueList.includes(themeValue.value)) {
    themeValue.value = Theme.Auto;
  }
  if (themeValue.value === Theme.Auto) {
    return systemTheme;
  }
  return themeValue.value;
});
function updateDomTheme() {
  document.documentElement.dataset.theme = theme.value;
}
watch(theme, updateDomTheme, { immediate: true });
