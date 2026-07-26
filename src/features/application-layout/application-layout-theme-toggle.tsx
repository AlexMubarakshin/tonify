'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button, Tooltip } from '@nextui-org/react';
import { useTranslations } from 'next-intl';

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/**
 * Two-state theme toggle.
 * - No stored preference → `defaultTheme="system"` resolves to the OS setting,
 *   so the icon and UI match the user's system on first visit.
 * - Clicking forces an explicit `light`/`dark` choice, which next-themes persists
 *   and re-applies on the next visit.
 */
export const ApplicationLayoutThemeToggle = () => {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const button = (
    <Button
      isIconOnly
      variant="light"
      radius="full"
      aria-label={t('header.themeToggle')}
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {/* Stable placeholder until mounted to avoid a hydration mismatch */}
      {!mounted ? <span className="w-5 h-5" /> : isDark ? <MoonIcon /> : <SunIcon />}
    </Button>
  );

  // Skip the tooltip until mounted so nothing depends on the pre-hydration theme.
  if (!mounted) return button;

  return (
    <Tooltip content={t('header.themeToggle')} closeDelay={0}>
      {button}
    </Tooltip>
  );
};
