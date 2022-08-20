/*
 *
 * ValidatorPage
 *
 */

import React from "react";
import { useQuery } from "react-query";
import { useIntl } from "react-intl";
import { stringify } from "qs";
import {
  CarouselInput,
  CarouselActions,
  CarouselSlide,
  CarouselImage,
} from "@strapi/design-system/CarouselInput";
import { Flex } from "@strapi/design-system/Flex";
import { Icon } from "@strapi/design-system/Icon";
import { IconButton } from "@strapi/design-system/IconButton";
import { EmptyStateLayout } from "@strapi/helper-plugin";
import DownloadIcon from "@strapi/icons/Download";
import InvalidIcon from "@strapi/icons/Cross";
import ValidIcon from "@strapi/icons/Check";

import downloadFile from "../../utils/downloadFile";
import getTrad from "../../utils/getTrad";
import axios from "../../utils/axiosInstance";

const findAssets = async () => {
  const search = stringify({
    populate: ["attachments"],
  });
  const res = await axios.get(
    "/content-manager/collection-types/api::runner.runner?" + search
  );

  return res.data.results.reduce((acc, c) => {
    const { attachments, ...runner } = c;
    return [
      ...acc,
      ...(attachments ?? [])
        .filter(({ valid }) => valid === null || valid === undefined)
        .map((a) => ({ ...a, runner })),
    ];
  }, []);
};
const updateAsset = async (assetId: number, valid: boolean) => {
  return axios.put(`/atonallure/validate/${assetId}`, { data: { valid } });
};

const ValidatorPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const { data: assetsToValidate } = useQuery("validate", findAssets, {
    placeholderData: [],
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleNext = React.useCallback(() => {
    if (!assetsToValidate || !assetsToValidate.length) return;
    setSelectedIndex((current) =>
      current < assetsToValidate.length ? current + 1 : 0
    );
  }, [assetsToValidate]);
  const handlePrevious = React.useCallback(() => {
    if (!assetsToValidate || !assetsToValidate.length) return;
    setSelectedIndex((current) =>
      current > 0 ? current - 1 : assetsToValidate.length - 1
    );
  }, [assetsToValidate]);
  const asset = React.useMemo(
    () => (assetsToValidate?.length ? assetsToValidate[selectedIndex] : {}),
    [assetsToValidate, selectedIndex]
  );

  const handleSubmit = React.useCallback(
    (valid: boolean) => async () => {
      if (asset?.id) await updateAsset(asset.id, valid);
      handleNext();
    },
    [asset, handleNext]
  );

  if (!asset || !assetsToValidate?.length)
    return (
      <Flex
        padding={4}
        justifyContent="center"
        style={{ width: "100%", height: "100%" }}
      >
        <EmptyStateLayout
          content={{
            id: getTrad("file.actions.empty"),
            defaultMessage: "Aucun document à valider",
          }}
          icon="media"
          hasRadius
        />
      </Flex>
    );

  return (
    <Flex
      padding={4}
      justifyContent="center"
      style={{ width: "100%", height: "100%" }}
    >
      <CarouselInput
        label={`Valider les documents (${selectedIndex + 1}/${
          assetsToValidate?.length
        })`}
        secondaryLabel={(asset.name?.startsWith("certificate")
          ? "Certificat"
          : "Document"
        )
          .concat(" - ")
          .concat(asset.runner?.fullname ?? "#N/A")}
        previousLabel="Précédent"
        nextLabel="Suivant"
        hint=""
        selectedSlide={selectedIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
        actions={
          <CarouselActions>
            <IconButton
              label={formatMessage({
                id: getTrad("file.invalid"),
                defaultMessage: "Invalider",
              })}
              onClick={handleSubmit(false)}
              icon={<Icon as={InvalidIcon} color="danger500" />}
            />
            <IconButton
              label={formatMessage({
                id: getTrad("control-card.download"),
                defaultMessage: "Download",
              })}
              onClick={() => downloadFile(asset.url, asset.name)}
              icon={<DownloadIcon />}
            />
            <IconButton
              label={formatMessage({
                id: getTrad("file.valid"),
                defaultMessage: "Valider",
              })}
              onClick={handleSubmit(true)}
              icon={<Icon as={ValidIcon} color="success500" />}
            />
          </CarouselActions>
        }
      >
        {(assetsToValidate ?? []).map((asset) => (
          <CarouselSlide
            key={asset.id}
            height={Math.min(Math.max(asset.height, 150), 1200) + "px"}
            width={Math.min(Math.max(asset.width, 300), 800) + "px"}
            label={`${asset.runner?.fullname ?? "#N/A"}`}
            style={{ maxHeight: "80vh" }}
          >
            <CarouselImage height="80%" src={asset.url} alt={asset.name} />
          </CarouselSlide>
        ))}
      </CarouselInput>
    </Flex>
  );
};

export default ValidatorPage;
