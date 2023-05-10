import { createContext, FunctionComponent, useContext } from "react";

export type FeatureFlags = {
  beta: boolean;
};

export const FeatureFlagsContext = createContext<FeatureFlags | undefined>(
  undefined
);

export const useFeatureFlags = (): FeatureFlags => {
  const answer = useContext(FeatureFlagsContext);
  if (answer === undefined) {
    throw new Error(
      "useFeatureFlags must be used inside a FeatureFlagContext provider"
    );
  }
  return answer;
};

export const FeatureFlagProvider: FunctionComponent = ({ children }) => {
  const value = {
    beta: window.location.pathname.startsWith("/preview"),
  } as FeatureFlags;
  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};
