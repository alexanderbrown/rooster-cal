import { parseDate, parseTime } from "./datetime";

test('Parse dates', () => {
    expect(parseDate('01/02/2020')).toBe('01/02/2020');
    expect(parseDate('01-02-2020')).toBe('01/02/2020');

    expect(parseDate('3/04/2020')).toBe('03/04/2020');
    expect(parseDate('03/4/2020')).toBe('03/04/2020');
    expect(parseDate('3/4/2020')).toBe('03/04/2020');
    
    expect(parseDate('05/06/20')).toBe('05/06/2020');

  });


test('Parse times', () => {
    expect(parseTime('01:20')).toBe('01:20');
    expect(parseTime('01-20')).toBe('01:20');
    expect(parseTime('01.20')).toBe('01:20');
    expect(parseTime('01;20')).toBe('01:20');

    expect(parseTime('1:20')).toBe('01:20');
    expect(parseTime('01:2')).toBe('01:02');
    expect(parseTime('1:2')).toBe('01:02');
})