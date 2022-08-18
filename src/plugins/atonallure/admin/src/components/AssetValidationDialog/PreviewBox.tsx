import React from 'react';
import { useIntl } from 'react-intl';
import { Stack } from '@strapi/design-system/Stack';
import { IconButton } from '@strapi/design-system/IconButton';
import DownloadIcon from '@strapi/icons/Download';

import createAssetUrl from '../../utils/createAssetUrl';
import getTrad from '../../utils/getTrad';
import downloadFile from '../../utils/downloadFile';
import {
  RelativeBox,
  ActionRow,
  Wrapper,
} from './components';

const PreviewBox = ({
  asset,
  canDownload,
}) => {
  const { formatMessage } = useIntl();
  const assetUrl = React.useMemo(() => createAssetUrl(asset, false), [asset]);

  return (
    <RelativeBox hasRadius background="neutral150" borderColor="neutral200">
      <ActionRow paddingLeft={3} paddingRight={3} justifyContent="flex-end">
        <Stack spacing={1} horizontal>
          {canDownload && (
            <IconButton
              label={formatMessage({
                id: getTrad('control-card.download'),
                defaultMessage: 'Download',
              })}
              icon={<DownloadIcon />}
              onClick={() => downloadFile(assetUrl, asset.name)}
            />
          )}
        </Stack>
      </ActionRow>

      <Wrapper>
        <img src={assetUrl} alt={asset.alternativeText} />
      </Wrapper>
    </RelativeBox>
  );
};

export default PreviewBox;
