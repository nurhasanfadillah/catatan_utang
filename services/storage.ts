// This file now only handles local preferences like Theme.
// Transaction data has moved to Supabase via services/api.ts

const THEME_KEY = 'kasbon_theme_v1';

export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark';
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};