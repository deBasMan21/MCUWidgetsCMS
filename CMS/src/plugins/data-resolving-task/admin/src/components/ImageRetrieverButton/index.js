import React from 'react';
import { Button } from '@strapi/design-system/Button';
import Picture from '@strapi/icons/Picture';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useFetchClient } from '@strapi/helper-plugin'
import pluginId from '../../pluginId'

const ImageRetrieverButton = () => {
  // Get page context
  const {
    slug,
    isCreatingEntry,
    initialData,
    isSingleType,
  } = useCMEditViewDataManager();

  const client = useFetchClient();

  // Handler for button click
  const retrieveImages = async () => {
    // Call backend to retrieve images
    await client.post(`/${pluginId}/retrieveImages`, { id: initialData.id })

    // Reload after images are retrieved to show them on the page
    window.location.reload()
  }

  // Check if we are on the correct page
  if (slug !== 'api::mcu-project.mcu-project' || isCreatingEntry || isSingleType || !initialData.tmdb_id) {
    return null;
  }

  // Return button
  return (
    <>
      <Button
        onClick={retrieveImages}
        size="S"
        startIcon={<Picture />}
      >
        Retrieve Images
      </Button>
    </>
  );
};

export default ImageRetrieverButton;
