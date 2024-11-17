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
import { Loader } from '@strapi/design-system/Loader';
import { Alert } from '@strapi/design-system/Alert';
import { useFetchClient } from "@strapi/strapi/admin";

const HomePage = () => {
  const client = useFetchClient();

  const [showAlert, setShowAlert] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState('')
  const [alertType, setAlertType] = React.useState('')

  const getRatings = async () => {
    try {
      await client.post(`/${pluginId}/updateProjectData`)
      openAlert('success', 'Project data updated')
    } catch (error) {
      console.log(error)
      openAlert('danger', 'Updating project data failed')
    }
  }

  const getReviews = async () => {
    try {
      await client.post(`/${pluginId}/updateReviews`)
      openAlert('success', 'Reviews updated')
    } catch (error) {
      console.log(error)
      openAlert('danger', 'Updating reviews failed')
    }
  }

  const updateAllSeries = async () => {
    try {
      await client.post(`/${pluginId}/updateAllSeries`)
      openAlert('success', 'Series updated')
    } catch (error) {
      console.log(error)
      openAlert('danger', 'Updating series failed')
    }
  }

  const updateSeasons = async () => {
    try {
      await client.post(`/${pluginId}/updateSeasons`)
      openAlert('success', 'Seasons updated')
    } catch (error) {
      console.log(error)
      openAlert('danger', 'Updating seasons failed')
    }
  }

  const getCollection = async () => {
    try {
      await client.post(`/${pluginId}/updateCollections`)
      openAlert('success', 'Collections updated')
    } catch (error) {
      console.log(error)
      openAlert('danger', 'Getting collections failed')
    }
  }

  const openAlert = async (type, message) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)

    await new Promise(resolve => setTimeout(resolve, 5000));
    closeAlert()
  }

  const closeAlert = () => {
    setShowAlert(false)
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

            <TaskButton
              buttonText="Update collections"
              explanationText="Retrieves all collections from the projects and creates them if necessary. It also creates the relations between the projects and the collections."
              onClick={getCollection}
            />
          </Stack>
        </Box>
      </Box>

      { showAlert &&
        <Alert
          title="Task is executed!"
          variant={alertType}
          onClose={closeAlert}
          style={{
            marginTop: '16px',
          }}
        >
          {alertMessage}
        </Alert>
      }
    </Box>
  );
};

export default HomePage;

const TaskButton = (props) => {
  const [showLoader, setShowLoader] = React.useState(false)

  const onClick = async () => {
    setShowLoader(true)
    await props.onClick()
    setShowLoader(false)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      gap: '16px',
    }}>
      <Button
      onClick={onClick}
      size="S"
      variant="secondary"
      disabled={showLoader}
      style={{
        width: '200px',
        justifyContent: 'center',
      }}
      >
        {props.buttonText}
      </Button>

      { showLoader && <Loader small /> }

      <Typography
        variant="omega"
        textColor="neutral1000"
      >
        {props.explanationText}
      </Typography>
    </div>
  )
}
