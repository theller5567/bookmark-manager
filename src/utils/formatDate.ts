
export const formatDate = (date: string | null): string => {
    if (!date) return 'Never';

    const parsedDate = new Date(date);

    if (!Number.isFinite(parsedDate.getTime())) {
        return 'Never';
    }

    const options = { month: 'short', day: 'numeric', timeZone: 'UTC' } as const;
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(parsedDate);
    return formattedDate;
}
