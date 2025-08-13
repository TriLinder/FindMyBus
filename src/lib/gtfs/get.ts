import { getStopTimesDataKeyFromTripId } from "$lib/utils";
import { loadDataInChunks } from "$lib/file-storage";

import type { StopTimes } from "./types";

export async function getStopTimesForTrip(tripId: string) {
    const key = await getStopTimesDataKeyFromTripId(tripId);
    const data = JSON.parse(await loadDataInChunks(key)) as Record<string, StopTimes> ;
    return data[tripId];
}