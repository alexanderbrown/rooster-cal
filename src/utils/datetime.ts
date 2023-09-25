import { DateTime } from "luxon"

const outputDateFormat = 'dd/MM/yyyy'

export function parseDate(date: string, inputDateFormat: string): string {
    return DateTime.fromFormat(date, inputDateFormat).toFormat(outputDateFormat)
}

export function parseTime(time: string): string {
    let [hours, minutes] = time.split('-').join(':')
                               .split('.').join(':')
                               .split(';').join(':')
                               .split(':')
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}