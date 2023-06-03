import { DateTime } from "luxon"

const dateFormat = 'dd/MM/yyyy'

export function parseDate(date: string): string {
    let [day,month,year] = date.split('-').join('/').split('/').map(entry => parseInt(entry))
    if (year < 100) year += 2000
    return DateTime.fromObject({day, month, year}).toFormat(dateFormat)
}

export function parseTime(time: string): string {
    let [hours, minutes] = time.split('-').join(':')
                               .split('.').join(':')
                               .split(';').join(':')
                               .split(':')
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}