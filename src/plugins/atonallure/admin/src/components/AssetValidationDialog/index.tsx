import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useIntl } from "react-intl";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@strapi/design-system/ModalLayout";
import { Button } from "@strapi/design-system/Button";
import { Typography } from "@strapi/design-system/Typography";
import { stringify } from "qs";

import PreviewBox from "./PreviewBox";
import getTrad from "../../utils/getTrad";
import axios from "../../utils/axiosInstance";

const findAssets = async () => {
  const search = stringify({
    populate: {
      attachments: { filters: { valid: { $null: true } } },
    },
  });
  const data = await axios
    .get("/content-manager/collection-types/api::runner.runner?" + search)
    .then((res) => res.data.results);
  return data.reduce((acc, c) => {
    const { attachments = [], ...runner } = c;
    return [...acc, ...attachments.map((a) => ({ ...a, runner }))];
  }, []);
};
const updateAsset = async (assetId: number, valid: boolean) => {
  return axios.put(`/atonallure/validate/${assetId}`, { data: { valid } });
};

const AssetValidationDialog = ({ onClose, initAsset, canDownload }) => {
  const [cursor, setCursor] = useState(0);
  const { formatMessage } = useIntl();
  const { data: assetsToValidate } = useQuery("validate", findAssets, {
    placeholderData: [],
  });
  const asset = useMemo(() => {
    if (assetsToValidate?.length) return assetsToValidate[cursor];
    return initAsset;
  }, [assetsToValidate, cursor, initAsset]);

  const handleSubmit = React.useCallback(
    (valid: boolean) => async () => {
      if (asset?.id) await updateAsset(asset.id, valid);
      setCursor((prev) => prev + 1);
    },
    [asset]
  );

  React.useEffect(() => {
    if (assetsToValidate?.length && cursor >= assetsToValidate.length)
      onClose();
  }, [cursor, assetsToValidate?.length, onClose]);

  return (
    <ModalLayout onClose={onClose} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {asset?.name.startsWith("certificate-") ? "Certificat " : "Document "}
          de {asset?.runner?.fullname}
        </Typography>
      </ModalHeader>
      <ModalBody>
        {asset ? <PreviewBox asset={asset} canDownload={canDownload} /> : null}
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={onClose} variant="tertiary">
            {formatMessage({ id: "global.back", defaultMessage: "Fermer" })}
          </Button>
        }
        endActions={
          <>
            <Button variant="danger" onClick={handleSubmit(false)}>
              {formatMessage({
                id: getTrad("file.invalid"),
                defaultMessage: "Invalider",
              })}
            </Button>
            <Button onClick={handleSubmit(true)}>
              {formatMessage({
                id: getTrad("file.valid"),
                defaultMessage: "Valider",
              })}
            </Button>
          </>
        }
      />
    </ModalLayout>
  );
};

export default AssetValidationDialog;
