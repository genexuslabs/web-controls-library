import { ObjectValues } from "../../common/types";

export const UI_LIST_DATA_STATE = {
  initial: "initial",
  moreDataToFetch: "more-data-to-fetch",
  allRecordsLoaded: "all-records-loaded"
} as const;

export type DataState = ObjectValues<typeof UI_LIST_DATA_STATE>;
