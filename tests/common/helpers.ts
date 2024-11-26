function parseDate(dateString: string): Date {
    const [datePart, timePart, period] = dateString.split(/[ ,]+/);
    const [month, day, year] = datePart.split('/').map(Number);
    // eslint-disable-next-line prefer-const
    let [hours, minutes, seconds] = timePart.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    return new Date(year, month, day, hours, minutes, seconds);
}
export function timeDifference(dateStr1: string, dateStr2: string): number {
    const date1 = parseDate(dateStr1);
    const date2 = parseDate(dateStr2);
    return Math.abs(date1.getTime() - date2.getTime()); // 10 seconds
}

