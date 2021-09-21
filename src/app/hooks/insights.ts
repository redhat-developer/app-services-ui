import { InsightsType } from "@app/utils";

export const useInsights = () => {
  const insights = window['insights'] as InsightsType;
  if (insights === undefined) {
    throw new Error("must be used inside an initialized insights context");
  }
  return insights;
}
