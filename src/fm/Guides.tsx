import { VoidFunctionComponent } from "react";
import QuickStartLoaderFederated from "@app/pages/Resources/QuickStartLoaderFederated";
import { AppEntry } from "../AppEntry";

export const Guides: VoidFunctionComponent = () => {
  return (
    <AppEntry>
      <QuickStartLoaderFederated />
    </AppEntry>
  );
};

export default Guides;
