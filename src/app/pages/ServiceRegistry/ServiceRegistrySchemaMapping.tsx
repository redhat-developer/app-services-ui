import React from 'react';
import { useParams } from 'react-router-dom';
import { RegistryRest } from '@rhoas/registry-management-sdk';
import { FederatedApicurioComponent } from './FederatedApicurioComponent';
import { FederatedModule } from '@app/components';
import { AppServicesLoading } from '@rhoas/app-services-ui-components';

export const ServiceRegistrySchemaMapping: React.FC = () => {
  const { topicName } = useParams<{ topicName: string }>();
  const basename = '/service-registry';

  return (
    <>
      <FederatedModule
        scope="srs"
        module="./ServiceRegistryMapping"
        fallback={<AppServicesLoading />}
        render={(ServiceRegistryFederated) => {
          return (
            <ServiceRegistryFederated
              basename={basename}
              topicName={topicName}
              renderSchema={(registry: RegistryRest) => (
                <FederatedApicurioComponent
                  module="./FederatedSchemaMapping"
                  registry={registry}
                  topicName={topicName}
                  groupId={null}
                  version={'latest'}
                  registryId={registry?.id}
                  basename={basename}
                />
              )}
            />
          );
        }}
      />
    </>
  );
};
