import React from "react";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import {
  prefixFileUrlWithBackendUrl,
  useCMEditViewDataManager,
} from "@strapi/helper-plugin";
import { Race } from "../../../typings";

import axios from "../utils/axiosInstance";
import { printUrl } from "../utils/printer";

const putNumberSigns = async (race: Race) =>
  Promise.all(
    race.runs.map(async (run, i) => {
      if (typeof run.numberSign === "number" && run.numberSign > 0) return run;
      const numberSign = i + 1;
      await axios.put(
        `/content-manager/collection-types/api::run.run/${run.id}`,
        { ...run, numberSign }
      );
      return run;
    })
  );

const PrintNumberSign: React.FC = () => {
  const { modifiedData: race } = useCMEditViewDataManager();
  const iframeUrl = React.useMemo(
    () =>
      race?.id
        ? prefixFileUrlWithBackendUrl(`/atonallure/print/${race.id}`)
        : null,
    [race?.id]
  );
  const handleClick = React.useCallback<React.MouseEventHandler>(async () => {
    if (!iframeUrl) return;
    await putNumberSigns(race);
    printUrl(iframeUrl);
  }, [race, printUrl]);

  return race.publishedAt ? (
    <Box paddingTop={4}>
      <Button fullWidth size="L" onClick={handleClick}>
        Imprimer les dossards
      </Button>
    </Box>
  ) : null;
};

export default PrintNumberSign;
