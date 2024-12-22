import React from 'react';
import { Button } from '@strapi/design-system/Button';
import EmotionHappy from '@strapi/icons/EmotionHappy';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useFetchClient } from '@strapi/helper-plugin'
import pluginId from '../../pluginId'

const ActorsUpdateButton = () => {
  // Get page context
  const {
    slug,
    isCreatingEntry,
    initialData,
    isSingleType,
  } = useCMEditViewDataManager();

  const client = useFetchClient();

  // Handler for button click
  const updateActors = async () => {
    // Call backend to retrieve images
    await client.post(`/${pluginId}/updateActors`, { id: initialData.id })

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
        onClick={updateActors}
        size="S"
        startIcon={<EmotionHappy />}
        variant="secondary"
      >
        Update actors
      </Button>
    </>
  );
};

export default ActorsUpdateButton;
