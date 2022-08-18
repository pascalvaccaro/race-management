/*
 *
 * ValidatorPage
 *
 */

import React from 'react';
import AssetValidationDialog from '../../components/AssetValidationDialog';

const ValidatorPage: React.FC = () => {
  const [show, setShow] = React.useState(true);
  return show ? <AssetValidationDialog initAsset={null} onClose={() => setShow(false)} canDownload /> : null;
};

export default ValidatorPage;
