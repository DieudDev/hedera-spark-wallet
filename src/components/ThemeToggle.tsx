import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to dark for crypto aesthetic
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:glow-accent transition-all duration-300 animate-pulse-glow"
        >
          <div className="animate-float">
            {getThemeIcon()}
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-gradient-card border-primary/20 backdrop-blur-sm"
      >
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="hover:bg-gradient-hero cursor-pointer transition-all duration-300"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="hover:bg-gradient-hero cursor-pointer transition-all duration-300"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className="hover:bg-gradient-hero cursor-pointer transition-all duration-300"
        >
          <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;