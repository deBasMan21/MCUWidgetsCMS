// path: ./yourProjectName/src/admin/app.js

import AuthLogo from './extensions/mcuWidgetsLogoDark.png';
import MenuLogo from './extensions/mcuWidgetsLogoDark.png';
import favicon from './extensions/mcuWidgetsLogoDark.ico';

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
   // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: MenuLogo,
    },
    // Override or extend the theme
    theme: {
      dark: {
        colors: {
          primary700: '#ff0006',
          primary600: '#ff0006',
          primary500: '#ff0006',
          primary200: '#1c1c1e',
          primary100: '#1c1c1e',
          danger700: '#FFA500',
          buttonPrimary700: '#ff0006',
          buttonPrimary600: '#ff0006',
          buttonPrimary500: '#ff0006',
          neutral0: '#454548',
          neutral100: '#1c1c1e',
          neutral1000: '#ffffff',
          neutral150: '#454548',
          neutral200: '#ffffff',
          neutral300: '#666687',
          neutral400: '#a5a5ba',
          neutral500: '#c0c0cf',
          neutral600: '#a5a5ba',
          neutral700: '#eaeaef',
          neutral800: '#ffffff',
          neutral900: '#ffffff',
        }
      },
      light: {
        colors: {
          primary700: '#ff0006',
          primary600: '#ff0006',
          primary500: '#ff0006',
          primary200: '#ededef',
          primary100: '#ededef',
          danger700: '#FFA500',
          buttonPrimary700: '#ff0006',
          buttonPrimary600: '#ff0006',
          buttonPrimary500: '#ff0006'
        }
      }
    },
   // Disable notifications about new Strapi releases
    notifications: { release: false },
  },

  bootstrap() {},
};
