import { prefixFileUrlWithBackendUrl } from '@strapi/helper-plugin';

export default (asset: any, forThumbnail = true) => {
  if (asset.isLocal) {
    return asset.url;
  }

  const assetUrl = forThumbnail ? asset?.formats?.thumbnail?.url || asset.url : asset.url;
  const backendUrl = prefixFileUrlWithBackendUrl(assetUrl);

  return `${backendUrl}?updated_at=${asset.updatedAt}`;
};
