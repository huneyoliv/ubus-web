import { create } from 'zustand';
import Cookies from 'js-cookie';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  console.log('[DEBUG] Inicializando Theme Store');
  
  const savedTheme = Cookies.get('theme');
  const initialDark = savedTheme === 'dark';

  if (initialDark) {
    document.documentElement.classList.add('dark');
  }

  return {
    isDarkMode: initialDark,
    toggleTheme: () => set((state) => {
      const newDark = !state.isDarkMode;
      console.log(`[DEBUG] Alternando tema para: ${newDark ? 'dark' : 'light'}`);
      
      if (newDark) {
        document.documentElement.classList.add('dark');
        Cookies.set('theme', 'dark', { expires: 365 });
      } else {
        document.documentElement.classList.remove('dark');
        Cookies.set('theme', 'light', { expires: 365 });
      }
      
      return { isDarkMode: newDark };
    }),
    setTheme: (isDark) => {
      console.log(`[DEBUG] Definindo tema explicitamente para: ${isDark ? 'dark' : 'light'}`);
      if (isDark) {
        document.documentElement.classList.add('dark');
        Cookies.set('theme', 'dark', { expires: 365 });
      } else {
        document.documentElement.classList.remove('dark');
        Cookies.set('theme', 'light', { expires: 365 });
      }
      set({ isDarkMode: isDark });
    },
  };
});
