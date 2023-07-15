import React from 'react';
import { Button } from '@strapi/design-system/Button';
import Cloud from '@strapi/icons/Cloud';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useFetchClient } from '@strapi/helper-plugin'
import pluginId from '../../pluginId'

const ProjectUpdateButton = () => {
  // Get page context
  const {
    slug,
    isCreatingEntry,
    initialData,
    isSingleType,
  } = useCMEditViewDataManager();

  const client = useFetchClient();

  // Handler for button click
  const updateData = async () => {
    // Call backend to update data
    await client.post(`/${pluginId}/updateSingleProject`, { id: initialData.id })

    // Reload after the data is updated
    window.location.reload()
  }

  // Check if we are on the correct page
  if (slug !== 'api::mcu-project.mcu-project' || isCreatingEntry || isSingleType || !initialData.imdb_id) {
    return null;
  }

  // Return button
  return (
    <>
      <Button
        onClick={updateData}
        size="S"
        startIcon={<Cloud />}
        variant="secondary"
      >
        Update imdb data
      </Button>
    </>
  );
};

export default ProjectUpdateButton;
