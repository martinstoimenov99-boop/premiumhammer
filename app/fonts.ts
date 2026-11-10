import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';

export const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['500'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
});
