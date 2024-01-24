import type { Schema, Attribute } from '@strapi/strapi';

export interface EpisodeEpisode extends Schema.Component {
  collectionName: 'components_episode_episodes';
  info: {
    displayName: 'Episode';
    description: '';
  };
  attributes: {
    Title: Attribute.String & Attribute.Required;
    Description: Attribute.RichText;
    EpisodeReleaseDate: Attribute.Date;
    EpisodeNumber: Attribute.Integer & Attribute.Required;
    Duration: Attribute.Integer;
    tmdb_id: Attribute.String & Attribute.Required;
    Rating: Attribute.Decimal;
    voteCount: Attribute.Integer;
    imageUrl: Attribute.String;
  };
}

export interface EpisodeSeason extends Schema.Component {
  collectionName: 'components_episode_seasons';
  info: {
    displayName: 'Season';
    description: '';
  };
  attributes: {
    SeasonNumber: Attribute.Integer & Attribute.Required;
    NumberOfEpisodes: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    seasonProject: Attribute.Relation<
      'episode.season',
      'oneToOne',
      'api::mcu-project.mcu-project'
    >;
    imageUrl: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface HomePageActorsPage extends Schema.Component {
  collectionName: 'components_home_page_actors_page';
  info: {
    displayName: 'Actors Page Link';
    icon: 'user';
    description: '';
  };
  attributes: {
    actors: Attribute.Relation<
      'home-page.actors-page',
      'oneToMany',
      'api::actor.actor'
    >;
  };
}

export interface HomePageDirectorsPage extends Schema.Component {
  collectionName: 'components_home_page_directors_page';
  info: {
    displayName: 'Directors Page Link';
    icon: 'user';
  };
  attributes: {
    directors: Attribute.Relation<
      'home-page.directors-page',
      'oneToMany',
      'api::director.director'
    >;
  };
}

export interface HomePageHighlightItem extends Schema.Component {
  collectionName: 'components_home_page_highlight_items';
  info: {
    displayName: 'Highlight Item';
    description: '';
    icon: 'landscape';
  };
  attributes: {
    contentType: Attribute.Enumeration<
      ['mcu-projects', 'actors', 'directors', 'collections', 'news-items']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'mcu-projects'>;
    contentTypeId: Attribute.Integer & Attribute.Required;
    title: Attribute.String;
    subtitle: Attribute.String;
  };
}

export interface HomePageHorizontalList extends Schema.Component {
  collectionName: 'components_home_page_horizontal_lists';
  info: {
    displayName: 'Horizontal List';
    description: '';
    icon: 'layer';
  };
  attributes: {
    title: Attribute.String;
    openMoreLink: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    numberOfItems: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<10>;
    contentType: Attribute.Enumeration<
      ['mcu-projects', 'directors', 'actors', 'collections', 'news-items']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'mcu-projects'>;
    filterAndSortKey: Attribute.String;
    viewType: Attribute.Enumeration<['poster', 'circle']> &
      Attribute.Required &
      Attribute.DefaultTo<'poster'>;
  };
}

export interface HomePageNewsItemList extends Schema.Component {
  collectionName: 'components_home_page_news_item_lists';
  info: {
    displayName: 'NewsItemList';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    news_items: Attribute.Relation<
      'home-page.news-item-list',
      'oneToMany',
      'api::news-item.news-item'
    >;
    title: Attribute.String & Attribute.Required;
    amountOfItems: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<3>;
  };
}

export interface HomePageNytReview extends Schema.Component {
  collectionName: 'components_home_page_nyt_reviews';
  info: {
    displayName: 'NYT Review';
    icon: 'feather';
    description: '';
  };
  attributes: {
    reviewTitle: Attribute.String & Attribute.Required;
    reviewSummary: Attribute.Text & Attribute.Required;
    reviewCopyright: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Copyright (c) 2023 The New York Times Company. All Rights Reserved.'>;
    project: Attribute.Relation<
      'home-page.nyt-review',
      'oneToOne',
      'api::mcu-project.mcu-project'
    > &
      Attribute.Private;
  };
}

export interface HomePageSpotifyEmbed extends Schema.Component {
  collectionName: 'components_home_page_spotify_embeds';
  info: {
    displayName: 'Spotify Embed';
    icon: 'music';
  };
  attributes: {
    embedCode: Attribute.Text & Attribute.Required;
    title: Attribute.String;
  };
}

export interface HomePageTextComponent extends Schema.Component {
  collectionName: 'components_home_page_text_components';
  info: {
    displayName: 'Text Component';
    icon: 'quote';
    description: '';
  };
  attributes: {
    text: Attribute.RichText & Attribute.Required;
  };
}

export interface HomePageTitle extends Schema.Component {
  collectionName: 'components_home_page_titles';
  info: {
    displayName: 'Title';
    icon: 'hashtag';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
  };
}

export interface HomePageVerticalList extends Schema.Component {
  collectionName: 'components_home_page_vertical_lists';
  info: {
    displayName: 'Vertical List';
    icon: 'bulletList';
  };
  attributes: {
    title: Attribute.String;
    openMoreLink: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    numberOfItems: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    contentType: Attribute.Enumeration<
      ['mcu-projects', 'actors', 'directors', 'collections', 'news-items']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'mcu-projects'>;
    filterAndSortKey: Attribute.String;
  };
}

export interface HomePageYoutubeEmbed extends Schema.Component {
  collectionName: 'components_home_page_youtube_embeds';
  info: {
    displayName: 'Youtube Embed';
    icon: 'slideshow';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    embedUrl: Attribute.String & Attribute.Required;
  };
}

export interface NewsItemCategory extends Schema.Component {
  collectionName: 'components_news_item_categories';
  info: {
    displayName: 'Category';
  };
  attributes: {
    category: Attribute.String & Attribute.Required;
  };
}

export interface NewsItemImage extends Schema.Component {
  collectionName: 'components_news_item_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    height: Attribute.Integer & Attribute.Required;
    width: Attribute.Integer & Attribute.Required;
  };
}

export interface PosterPoster extends Schema.Component {
  collectionName: 'components_poster_posters';
  info: {
    displayName: 'Poster';
    description: '';
  };
  attributes: {
    PosterUrl: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface TrailerTrailer extends Schema.Component {
  collectionName: 'components_trailer_trailers';
  info: {
    displayName: 'Trailer';
    description: '';
  };
  attributes: {
    TrailerName: Attribute.String & Attribute.Required;
    YoutubeLink: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'episode.episode': EpisodeEpisode;
      'episode.season': EpisodeSeason;
      'home-page.actors-page': HomePageActorsPage;
      'home-page.directors-page': HomePageDirectorsPage;
      'home-page.highlight-item': HomePageHighlightItem;
      'home-page.horizontal-list': HomePageHorizontalList;
      'home-page.news-item-list': HomePageNewsItemList;
      'home-page.nyt-review': HomePageNytReview;
      'home-page.spotify-embed': HomePageSpotifyEmbed;
      'home-page.text-component': HomePageTextComponent;
      'home-page.title': HomePageTitle;
      'home-page.vertical-list': HomePageVerticalList;
      'home-page.youtube-embed': HomePageYoutubeEmbed;
      'news-item.category': NewsItemCategory;
      'news-item.image': NewsItemImage;
      'poster.poster': PosterPoster;
      'trailer.trailer': TrailerTrailer;
    }
  }
}
