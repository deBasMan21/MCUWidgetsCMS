/*
 *
 * HomePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import ImageRetrieverButton from '../../components/ImageRetrieverButton';

const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
      <ImageRetrieverButton />
    </div>
  );
};

export default HomePage;
