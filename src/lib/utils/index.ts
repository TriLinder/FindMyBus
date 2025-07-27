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

export function adjustHexColorBrightness(hexColor: string, brightness: number) {
    // Remove the hash if present
    hexColor = hexColor.replace(/^#/, '');

    // Parse the RGB channels
    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);

    // Adjust brightness and clamp each value to 255
    r = Math.min(Math.round(r * brightness), 255);
    g = Math.min(Math.round(g * brightness), 255);
    b = Math.min(Math.round(b * brightness), 255);

    // Convert back to two-digit hex values and concatenate
    return '#' + (
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
}
