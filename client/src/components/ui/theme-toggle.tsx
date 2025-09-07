// ABOUTME: Theme toggle component for switching between different IDE themes
// ABOUTME: Provides a dropdown menu with theme previews and selection

import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  const currentTheme = themes.find(t => t.value === theme);

  const getButtonPosition = () => {
    if (!buttonRef) return { top: 0, left: 0 };
    const rect = buttonRef.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.right - 192 + window.scrollX // 192px is the width of the dropdown
    };
  };

  return (
    <div className="relative">
      <button
        ref={setButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs hover-gray px-2 py-1 rounded cursor-pointer"
      >
        <Palette className="h-3 w-3" />
        <span className="hidden sm:inline">{currentTheme?.name}</span>
      </button>

      {isOpen && createPortal(
        <div 
          className="fixed w-48 bg-sidebar border border-ide rounded-md shadow-lg z-50"
          style={{
            top: getButtonPosition().top,
            left: getButtonPosition().left
          }}
        >
          <div className="p-2">
            <div className="text-xs text-secondary-ide mb-2 px-2">Choose Theme</div>
            <div className="space-y-1">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 text-xs rounded hover-gray",
                    theme === themeOption.value && "bg-editor"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {/* Theme preview */}
                    <div className="flex gap-0.5">
                      <div 
                        className="w-3 h-3 rounded-sm border border-ide"
                        style={{ backgroundColor: themeOption.colors.background }}
                      />
                      <div 
                        className="w-3 h-3 rounded-sm border border-ide"
                        style={{ backgroundColor: themeOption.colors.sidebar }}
                      />
                      <div 
                        className="w-3 h-3 rounded-sm border border-ide"
                        style={{ backgroundColor: themeOption.colors.primaryAccent }}
                      />
                    </div>
                    <span className="text-primary-ide">{themeOption.name}</span>
                  </div>
                  {theme === themeOption.value && (
                    <Check className="h-3 w-3 text-primary-ide" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
