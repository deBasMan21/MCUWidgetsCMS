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
      'news-item.category': NewsItemCategory;
      'news-item.image': NewsItemImage;
      'poster.poster': PosterPoster;
      'trailer.trailer': TrailerTrailer;
    }
  }
}
