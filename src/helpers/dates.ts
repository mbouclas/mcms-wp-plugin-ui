import dayjs from 'dayjs';
export function dateFormat(date: string, format: string = 'DD/MM/YYYY @ HH:mm'): string {
    const obj = dayjs(date);
    return obj.format(format);
}
