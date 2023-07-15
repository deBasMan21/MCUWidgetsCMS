/*
 *
 * HomePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';
import { useFetchClient } from '@strapi/helper-plugin'

const HomePage = () => {
  const client = useFetchClient();

  const getRatings = async () => {
    await client.post(`/${pluginId}/updateProjectData`)
  }

  const getReviews = async () => {
    await client.post(`/${pluginId}/updateReviews`)
  }

  const updateAllSeries = async () => {
    await client.post(`/${pluginId}/updateAllSeries`)
  }

  const updateSeasons = async () => {
    await client.post(`/${pluginId}/updateSeasons`)
  }

  return (
    <Box background="neutral100" padding={8} >
      <Box padding={4} background="neutral0" hasRadius shadow="tableShadow">
        <Box background="neutral0" paddingBottom={4}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <Typography
              variant="alpha"
              textColor="neutral1000"
            >
              Data Tasks
            </Typography>

            <Typography
              variant="omega"
              textColor="neutral500"
            >
              These tasks are executed daily but here you can activate them manually to update all data. Be aware that this executes a lot of api calls so don't execute them manually too often.
            </Typography>
          </div>

          <Stack
            gap={8}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <TaskButton
              buttonText="Update project information"
              explanationText="Update information like: Box office, Runtime, Categories and Ratings."
              onClick={getRatings}
            />

            <TaskButton
              buttonText="Update project reviews"
              explanationText="Update information like: The review, the subtitle of the review and the copyright text."
              onClick={getReviews}
            />

            <TaskButton
              buttonText="Update series"
              explanationText="Update information like: The image, episode count and name of the series."
              onClick={updateAllSeries}
            />

            <TaskButton
              buttonText="Update season relations"
              explanationText="Update information like: The image, episode count and name of the season relations."
              onClick={updateSeasons}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;

const TaskButton = (props) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      gap: '16px',
    }}>
      <Button
      onClick={props.onClick}
      size="S"
      variant="secondary"
      style={{
        width: '200px',
        justifyContent: 'center',
      }}
      >
        {props.buttonText}
      </Button>

      <Typography
        variant="omega"
        textColor="neutral1000"
      >
        props.explanationText
      </Typography>
    </div>
  )
}
