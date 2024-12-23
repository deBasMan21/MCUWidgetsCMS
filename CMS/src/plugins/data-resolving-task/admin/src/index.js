import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import ImageRetrieverButton from './components/ImageRetrieverButton';
import ProjectUpdateButton from './components/ProjectUpdateButton';
import SerieUpdateButton from './components/SerieUpdateButton';
import VideoRetrieverButton from './components/VideoRetrieverButton';
import ActorsUpdateButton from './components/ActorsUpdateButton'

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import('./pages/App');

        return component;
      },
      permissions: [],
    });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "image-task",
      Component: ImageRetrieverButton
    })

    app.injectContentManagerComponent("editView", "right-links", {
      name: "video-task",
      Component: VideoRetrieverButton
    })

    app.injectContentManagerComponent("editView", "right-links", {
      name: "update-data-task",
      Component: ProjectUpdateButton
    })

    app.injectContentManagerComponent("editView", "right-links", {
      name: "update-serie-task",
      Component: SerieUpdateButton
    })

    app.injectContentManagerComponent("editView", "right-links", {
      name: "update-actors-task",
      Component: ActorsUpdateButton
    })
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
