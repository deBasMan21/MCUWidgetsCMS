import React from 'react';
import { Button } from '@strapi/design-system/Button';
import BulletList from '@strapi/icons/BulletList';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import pluginId from '../../pluginId'
import { useFetchClient } from "@strapi/strapi/admin";

const SerieUpdateButton = () => {
  // Get page context
  const {
    slug,
    isCreatingEntry,
    initialData,
    isSingleType,
  } = useCMEditViewDataManager();

  const client = useFetchClient();

  // Handler for button click
  const updateSerie = async () => {
    // Call backend to update data
    await client.post(`/${pluginId}/updateSingleSerie`, { id: initialData.id })

    // Reload after the data is updated
    window.location.reload()
  }

  // Check if we are on the correct page
  if (slug !== 'api::mcu-project.mcu-project' || isCreatingEntry || isSingleType || !initialData.tmdb_id || initialData.Type !== 'Serie') {
    return null;
  }

  // Return button
  return (
    <>
      <Button
        onClick={updateSerie}
        size="S"
        startIcon={<BulletList />}
        variant="secondary"
      >
        Update episode data
      </Button>
    </>
  );
};

export default SerieUpdateButton;
