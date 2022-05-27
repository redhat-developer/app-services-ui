import { FC } from "react";
import { FederatedModule } from "@app/components";

export const KasModalLoader: FC = ({ children }) => {
  return (
    <FederatedModule
      scope="kas"
      module="./KasModalLoader"
      fallback={null}
      render={(KasModalLoaderFederated) => {
        return <KasModalLoaderFederated>{children}</KasModalLoaderFederated>;
      }}
    />
  );
};
