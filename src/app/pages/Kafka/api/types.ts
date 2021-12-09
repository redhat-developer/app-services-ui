import { ConfigurationParameters, RangeQuery } from '@rhoas/kafka-management-sdk';

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
export type SafeRangeQuery = NoUndefinedField<RangeQuery>;

export type BasicApiConfigurationParameters = Pick<ConfigurationParameters, 'accessToken' | 'basePath'>;
