import React from "react";
import { renderToString } from "react-dom/server";
import Homepage from "../components/site/Homepage";
import { stays } from "../server/catalog.mjs";

export function renderDemo(assetPrefix: string) {
  return renderToString(
    <Homepage initialStays={stays} mode="snapshot" assetPrefix={assetPrefix} />,
  );
}
