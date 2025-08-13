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

export function dateToTimeString(date: Date): string {
    const usersPreferredFormat = get(settingsStore).timeFormat;

    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (usersPreferredFormat === '12hour') {
        const hours12 = date.getHours() % 12 || 12;
        const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
        const time12 = `${hours12}:${minutes} ${amPm}`;

        return time12;
    } else {
        const hours24 = String(date.getHours()).padStart(2, '0');
        const time24 = `${hours24}:${minutes}`;

        return time24;
    }
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

export async function sha256(data: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}

export async function getStopTimesDataKeyFromTripId(tripId: string) {
    return `stopTimes/${((await sha256(tripId)).substring(0, 2))}`;
}