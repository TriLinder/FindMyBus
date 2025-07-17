export function parseStopTimeStringToLocalTimezoneToday(timeString: string): Date {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        seconds || 0,
        0
    );
}