import type { Schema, Struct } from '@strapi/strapi';

export interface EpisodeEpisode extends Struct.ComponentSchema {
  collectionName: 'components_episode_episodes';
  info: {
    description: '';
    displayName: 'Episode';
  };
  attributes: {
    Description: Schema.Attribute.RichText;
    Duration: Schema.Attribute.Integer;
    EpisodeNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    EpisodeReleaseDate: Schema.Attribute.Date;
    imageUrl: Schema.Attribute.String;
    Rating: Schema.Attribute.Decimal;
    Title: Schema.Attribute.String & Schema.Attribute.Required;
    tmdb_id: Schema.Attribute.String & Schema.Attribute.Required;
    voteCount: Schema.Attribute.Integer;
  };
}

export interface EpisodeSeason extends Struct.ComponentSchema {
  collectionName: 'components_episode_seasons';
  info: {
    description: '';
    displayName: 'Season';
  };
  attributes: {
    imageUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    NumberOfEpisodes: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    SeasonNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    seasonProject: Schema.Attribute.Relation<
      'oneToOne',
      'api::mcu-project.mcu-project'
    >;
  };
}

export interface HomePageHeaderCategory extends Struct.ComponentSchema {
  collectionName: 'components_home_page_header_categories';
  info: {
    displayName: 'Category';
    icon: 'grid';
  };
  attributes: {
    category: Schema.Attribute.String;
  };
}

export interface HomePageHeaderGridItem extends Struct.ComponentSchema {
  collectionName: 'components_home_page_header_grid_items';
  info: {
    displayName: 'Grid Item';
    icon: 'dashboard';
  };
  attributes: {
    iconName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'star.circle.fill'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageDivider extends Struct.ComponentSchema {
  collectionName: 'components_home_page_dividers';
  info: {
    description: '';
    displayName: 'Divider';
    icon: 'oneToOne';
  };
  attributes: {
    color: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    height: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
  };
}

export interface HomePageHeaderWidget extends Struct.ComponentSchema {
  collectionName: 'components_home_page_header_widgets';
  info: {
    description: '';
    displayName: 'HeaderWidget';
    icon: 'layout';
  };
  attributes: {
    categories: Schema.Attribute.Component<'home-page-header.category', true>;
    contentType: Schema.Attribute.Enumeration<
      [
        'mcu-projects',
        'actors',
        'directors',
        'collections',
        'news-items',
        'pages',
      ]
    >;
    contentTypeId: Schema.Attribute.Integer;
    description: Schema.Attribute.RichText;
    gridItems: Schema.Attribute.Component<'home-page-header.grid-item', true>;
    imageUrl: Schema.Attribute.String & Schema.Attribute.Required;
    largeTitleAndGrid: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    showImage: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageHighlightItem extends Struct.ComponentSchema {
  collectionName: 'components_home_page_highlight_items';
  info: {
    description: '';
    displayName: 'Highlight Item';
    icon: 'landscape';
  };
  attributes: {
    contentType: Schema.Attribute.Enumeration<
      [
        'mcu-projects',
        'actors',
        'directors',
        'collections',
        'news-items',
        'pages',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'mcu-projects'>;
    contentTypeId: Schema.Attribute.Integer & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomePageHorizontalList extends Struct.ComponentSchema {
  collectionName: 'components_home_page_horizontal_lists';
  info: {
    description: '';
    displayName: 'Horizontal List';
    icon: 'layer';
  };
  attributes: {
    contentType: Schema.Attribute.Enumeration<
      [
        'mcu-projects',
        'directors',
        'actors',
        'collections',
        'news-items',
        'pages',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'mcu-projects'>;
    filterAndSortKey: Schema.Attribute.String;
    numberOfItems: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    openMoreLink: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
    viewType: Schema.Attribute.Enumeration<['poster', 'circle']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'poster'>;
  };
}

export interface HomePageNotificationsDialog extends Struct.ComponentSchema {
  collectionName: 'components_home_page_notifications_dialogs';
  info: {
    description: '';
    displayName: 'Notifications Dialog';
    icon: 'bell';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    topics: Schema.Attribute.Component<
      'notifications-dialog.notification-topic',
      true
    > &
      Schema.Attribute.Required;
  };
}

export interface HomePageNytReview extends Struct.ComponentSchema {
  collectionName: 'components_home_page_nyt_reviews';
  info: {
    description: '';
    displayName: 'NYT Review';
    icon: 'feather';
  };
  attributes: {
    project: Schema.Attribute.Relation<
      'oneToOne',
      'api::mcu-project.mcu-project'
    > &
      Schema.Attribute.Private;
    reviewCopyright: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Copyright (c) 2023 The New York Times Company. All Rights Reserved.'>;
    reviewSummary: Schema.Attribute.Text & Schema.Attribute.Required;
    reviewTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePagePageLink extends Struct.ComponentSchema {
  collectionName: 'components_home_page_page_links';
  info: {
    description: '';
    displayName: 'Page Link';
    icon: 'arrowRight';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    contentType: Schema.Attribute.Enumeration<
      [
        'mcu-projects',
        'actors',
        'directors',
        'collections',
        'news-items',
        'pages',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'mcu-projects'>;
    contentTypeId: Schema.Attribute.Integer & Schema.Attribute.Required;
    iconName: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageSpotifyEmbed extends Struct.ComponentSchema {
  collectionName: 'components_home_page_spotify_embeds';
  info: {
    displayName: 'Spotify Embed';
    icon: 'music';
  };
  attributes: {
    embedCode: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface HomePageTextComponent extends Struct.ComponentSchema {
  collectionName: 'components_home_page_text_components';
  info: {
    description: '';
    displayName: 'Text Component';
    icon: 'quote';
  };
  attributes: {
    text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface HomePageTitle extends Struct.ComponentSchema {
  collectionName: 'components_home_page_titles';
  info: {
    displayName: 'Title';
    icon: 'hashtag';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomePageVerticalList extends Struct.ComponentSchema {
  collectionName: 'components_home_page_vertical_lists';
  info: {
    description: '';
    displayName: 'Vertical List';
    icon: 'bulletList';
  };
  attributes: {
    contentType: Schema.Attribute.Enumeration<
      [
        'mcu-projects',
        'actors',
        'directors',
        'collections',
        'news-items',
        'pages',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'mcu-projects'>;
    filterAndSortKey: Schema.Attribute.String;
    numberOfItems: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    openMoreLink: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface HomePageYoutubeEmbed extends Struct.ComponentSchema {
  collectionName: 'components_home_page_youtube_embeds';
  info: {
    description: '';
    displayName: 'Youtube Embed';
    icon: 'slideshow';
  };
  attributes: {
    embedUrl: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface NewsItemCategory extends Struct.ComponentSchema {
  collectionName: 'components_news_item_categories';
  info: {
    displayName: 'Category';
  };
  attributes: {
    category: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NewsItemImage extends Struct.ComponentSchema {
  collectionName: 'components_news_item_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    height: Schema.Attribute.Integer & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface NotificationsDialogNotificationTopic
  extends Struct.ComponentSchema {
  collectionName: 'components_notifications_dialog_notification_topics';
  info: {
    description: '';
    displayName: 'NotificationTopic';
    icon: 'bell';
  };
  attributes: {
    topic: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderParallaxConfig extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_parallax_configs';
  info: {
    displayName: 'Parallax Config';
    icon: 'landscape';
  };
  attributes: {
    height: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<500>;
    imageUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PosterPoster extends Struct.ComponentSchema {
  collectionName: 'components_poster_posters';
  info: {
    description: '';
    displayName: 'Poster';
  };
  attributes: {
    PosterUrl: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface TrailerTrailer extends Struct.ComponentSchema {
  collectionName: 'components_trailer_trailers';
  info: {
    description: '';
    displayName: 'Trailer';
  };
  attributes: {
    TrailerName: Schema.Attribute.String & Schema.Attribute.Required;
    YoutubeLink: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'episode.episode': EpisodeEpisode;
      'episode.season': EpisodeSeason;
      'home-page-header.category': HomePageHeaderCategory;
      'home-page-header.grid-item': HomePageHeaderGridItem;
      'home-page.divider': HomePageDivider;
      'home-page.header-widget': HomePageHeaderWidget;
      'home-page.highlight-item': HomePageHighlightItem;
      'home-page.horizontal-list': HomePageHorizontalList;
      'home-page.notifications-dialog': HomePageNotificationsDialog;
      'home-page.nyt-review': HomePageNytReview;
      'home-page.page-link': HomePagePageLink;
      'home-page.spotify-embed': HomePageSpotifyEmbed;
      'home-page.text-component': HomePageTextComponent;
      'home-page.title': HomePageTitle;
      'home-page.vertical-list': HomePageVerticalList;
      'home-page.youtube-embed': HomePageYoutubeEmbed;
      'news-item.category': NewsItemCategory;
      'news-item.image': NewsItemImage;
      'notifications-dialog.notification-topic': NotificationsDialogNotificationTopic;
      'page-builder.parallax-config': PageBuilderParallaxConfig;
      'poster.poster': PosterPoster;
      'trailer.trailer': TrailerTrailer;
    }
  }
}
