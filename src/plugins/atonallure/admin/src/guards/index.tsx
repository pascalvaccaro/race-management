import React from "react";
import { useParams } from "react-router-dom";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";

const IsModelPage: React.FC<{
  modelName: string;
  children: React.ReactNode;
}> = ({ children, modelName }) => {
  const params = useParams();
  if (modelName in params) return <>{children}</>;
  return null;
};
export const IsRunPage: React.FC<{ children: React.ReactNode }> = (props) => (
  <IsModelPage modelName="run" {...props} />
);

export const IsRunnerPage: React.FC<{ children: React.ReactNode }> = (
  props
) => <IsModelPage modelName="runner" {...props} />;

export const IsRaceEditPage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const editDataManager = useCMEditViewDataManager();
  if (editDataManager?.slug === "api::race.race") return <>{children}</>;
  return null;
};
