import React from "react";
import { hydrateRoot } from "react-dom/client";
import Homepage from "../components/site/Homepage";
import { stays } from "../server/catalog.mjs";

const root = document.getElementById("root");
if (root) {
  hydrateRoot(
    root,
    <Homepage
      initialStays={stays}
      mode="snapshot"
      assetPrefix={document.documentElement.dataset.assetPrefix || ""}
    />,
  );
}
