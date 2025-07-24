import { settingsStore } from "../../stores";
import { get } from "svelte/store";

export function parseStopTimeStringToLocalTimezoneToday(timeString: string): Date {
    let [hours, minutes, seconds] = timeString.split(':').map(Number);
    let extraDays = 0;
    const now = new Date();

    while (hours >= 24) {
        extraDays += 1;
        hours -= 24
    }

    return new Date (new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        seconds || 0,
        0
    ).getTime() + extraDays * 24 * 60 * 60 * 1000);
}

export function speedInUsersPreferredUnitsString(speedInMetersPerSecond: number): string {
    switch(get(settingsStore).speedUnits) {
        case('kmph'): return `${Math.round(speedInMetersPerSecond * 3.6)} km/h`;
        case('mph'): return `${Math.round(speedInMetersPerSecond * 2.2369)} mph`;
        case('mps'): return `${Math.round(speedInMetersPerSecond)} m/s`;
    }
}