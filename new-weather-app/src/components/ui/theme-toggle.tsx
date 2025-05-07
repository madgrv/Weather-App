import React from 'react';
import { useTheme } from './theme-provider';
import { Switch } from './switch';
import { SunIcon, MoonAltIcon } from './svgs';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {theme === 'light' ? (
          <SunIcon size={20} className="w-5 h-5" />
        ) : (
          <MoonAltIcon size={20} className="w-5 h-5" />
        )}
      </span>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
    </div>
  );
}
