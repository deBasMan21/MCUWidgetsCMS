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
      colors: {
        alternative100: '#f6ecfc',
        alternative200: '#e0c1f4',
        alternative500: '#ac73e6',
        alternative600: '#9736e8',
        alternative700: '#8312d1',
        danger700: '#b72b1a'
      },
    },
   // Disable notifications about new Strapi releases
    notifications: { release: false },
  },

  bootstrap() {},
};
