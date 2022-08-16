import React from "react";
import { Button } from "@strapi/design-system/Button";
import { useQueryParams } from "@strapi/helper-plugin";

const commonQuery = {
  sort: "firstname:asc",
  filters: {},
  populate: {},
};
const docToValidQuery = {
  ...commonQuery,
  populate: 'attachments',
  filters: {
    $and: [{ attachments: { valid: true }}],
    // $or: [{ attachments: { valid: false }}, { attachments: { expiry: null }}],
  },
};
const RunnerManager: React.FC = () => {
  const [{ query }, setQuery] = useQueryParams();
  const isActive = React.useMemo(() => query?.populate === 'attachments', [query?.populate]);
  const handleClick = React.useCallback<React.MouseEventHandler>(() => {
    setQuery(isActive ? commonQuery : docToValidQuery);
  }, [isActive]);

  return (
    <Button onClick={handleClick} variant={isActive ? "default" : "secondary"}>
      Docs à valider
    </Button>
  );
};

export default RunnerManager;
