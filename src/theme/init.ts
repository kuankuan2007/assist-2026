import { Theme, themeValueList } from './define';

try {
  const initStorageTheme = localStorage.getItem('theme');
  window.document.documentElement.dataset.theme =
    themeValueList.includes(initStorageTheme as Theme) && initStorageTheme !== Theme.Auto
      ? (initStorageTheme as Theme)
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? Theme.Dark
        : Theme.Light;
} catch (e) {
  console.log(`Failed to init theme from storage: ${e}`);
  window.document.documentElement.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? Theme.Dark
    : Theme.Light;
}
