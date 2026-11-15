export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export const themeValueList = [Theme.Auto, Theme.Light, Theme.Dark] as const;
