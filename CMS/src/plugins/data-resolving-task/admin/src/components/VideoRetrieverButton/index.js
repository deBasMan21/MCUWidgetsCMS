import React from 'react';
import { Button } from '@strapi/design-system/Button';
import Play from '@strapi/icons/Play';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import pluginId from '../../pluginId'
import { useFetchClient } from "@strapi/strapi/admin";

const VideoRetrieverButton = () => {
  // Get page context
  const {
    slug,
    isCreatingEntry,
    initialData,
    isSingleType,
  } = useCMEditViewDataManager();

  const client = useFetchClient();

  // Handler for button click
  const retrieveVideos = async () => {
    // Call backend to retrieve images
    try {
      await client.post(`/${pluginId}/retrieveVideos`, { id: initialData.id })

      // Reload after images are retrieved to show them on the page
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  // Check if we are on the correct page
  if (slug !== 'api::mcu-project.mcu-project' || isCreatingEntry || isSingleType || !initialData.tmdb_id) {
    return null;
  }

  // Return button
  return (
    <>
      <Button
        onClick={retrieveVideos}
        size="S"
        startIcon={<Play />}
        variant="secondary"
      >
        Retrieve Videos
      </Button>
    </>
  );
};

export default VideoRetrieverButton;
