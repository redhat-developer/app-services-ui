import { FederatedModule } from '@app/components/FederatedModule/FederatedModule';
import React, { FunctionComponent } from 'react';
import { useConfig } from '@bf2/ui-shared';
import { Loading } from '@app/components/Loading/Loading';

export type QuickStartLoaderFederatedProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLoad: (quickStarts: any[]) => void;
}

export const QuickStartLoaderFederated: FunctionComponent<QuickStartLoaderFederatedProps> = ({ onLoad }) => {
  const config = useConfig();

  if (config === undefined) {
    return <Loading/>;
  }

  return (<FederatedModule
      scope="guides"
      module="./QuickStartLoader"
      render={(QuickStartLoaderFederated) => (
        <QuickStartLoaderFederated
          showDrafts={config?.guides.showDrafts}
          onLoad={onLoad}
        />
      )}
    />
  );
};

export default QuickStartLoaderFederated;