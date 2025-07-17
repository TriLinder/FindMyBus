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