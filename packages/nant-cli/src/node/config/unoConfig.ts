// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWind,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

import type { UserConfig } from 'unocss';

const colors = {
  primary: 'rgba(60, 60, 67)',
  'primary-dark': 'rgba(255, 255, 245, 0.86)',

  secondary: 'rgba(60, 60, 67, 0.75)',
  'secondary-dark': 'rgba(235, 235, 245, 0.6)',

  tertiary: 'rgba(60, 60, 67, 0.33)',
  'tertiary-dark': 'rgba(235, 235, 245, 0.38)',

  link: '#087EA4', // blue-50
  'link-dark': '#149ECA', // blue-40

  syntax: '',

  wash: '#FFFFFF',
  'wash-dark': '#1b1b1f',

  card: '#F6F7F9', // gray-05
  'card-dark': '#343A46', // gray-80
  highlight: '#E6F7FF', // blue-10
  'highlight-dark': 'rgba(88,175,223,.1)',
  border: '#EBECF0', // gray-10
  'border-dark': '#343A46', // gray-80

  // Gray
  'gray-95': '#16181D',
  'gray-90': '#23272F',
  'gray-80': '#343A46',
  'gray-70': '#404756',
  'gray-60': '#4E5769',
  'gray-50': '#5E687E',
  'gray-40': '#78839B',
  'gray-30': '#99A1B3',
  'gray-20': '#BCC1CD',
  'gray-15': '#D0D3DC',
  'gray-10': '#EBECF0',
  'gray-5': '#F6F7F9',

  // Blue
  'blue-80': '#043849',
  'blue-60': '#045975',
  'blue-50': '#087EA4',
  'blue-40': '#149ECA', // Brand Blue
  'blue-30': '#58C4DC', // unused
  'blue-20': '#ABE2ED',
  'blue-10': '#E6F7FF', // todo: doesn't match illustrations
  'blue-5': '#E6F6FA',

  // Yellow
  'yellow-60': '#B65700',
  'yellow-50': '#C76A15',
  'yellow-40': '#DB7D27', // unused
  'yellow-30': '#FABD62', // unused
  'yellow-20': '#FCDEB0', // unused
  'yellow-10': '#FDE7C7',
  'yellow-5': '#FEF5E7',

  // Purple
  'purple-60': '#2B3491', // unused
  'purple-50': '#575FB7',
  'purple-40': '#6B75DB',
  'purple-30': '#8891EC',
  'purple-20': '#C3C8F5', // unused
  'purple-10': '#E7E9FB',
  'purple-5': '#F3F4FD',

  // Green
  'green-60': '#2B6E62',
  'green-50': '#388F7F',
  'green-40': '#44AC99',
  'green-30': '#7FCCBF',
  'green-20': '#ABDED5',
  'green-10': '#E5F5F2',
  'green-5': '#F4FBF9',

  // RED
  'red-60': '#712D28',
  'red-50': '#A6423A', // unused
  'red-40': '#C1554D',
  'red-30': '#D07D77',
  'red-20': '#E5B7B3', // unused
  'red-10': '#F2DBD9', // unused
  'red-5': '#FAF1F0',
};

const unocssConfig: UserConfig = defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors,
  },
  presets: [
    presetUno(),
    presetWind(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});

export default unocssConfig;
