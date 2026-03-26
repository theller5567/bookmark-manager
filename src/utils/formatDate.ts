
export const formatDate = (date: string | null): string => {
    if (!date) return 'Never';

    const options = { month: 'short', day: 'numeric', timeZone: 'UTC' } as const;
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    return formattedDate;
}
