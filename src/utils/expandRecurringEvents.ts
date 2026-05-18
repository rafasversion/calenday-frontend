import { Event } from '../services/eventService';

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

export const expandRecurringEvents = (events: Event[], viewStart: Date, viewEnd: Date): Event[] => {
  const result: Event[] = [];

  for (const event of events) {
    if (event.recurrence === 'none' || !event.recurrence) {
      result.push(event);
      continue;
    }

    const origin = new Date(event.date_start);
    const current = new Date(viewStart);
    current.setHours(origin.getHours(), origin.getMinutes(), 0, 0);

    if (current < origin) {
      current.setFullYear(origin.getFullYear(), origin.getMonth(), origin.getDate());
    }

    let safetyCount = 0;

    while (current <= viewEnd && safetyCount < 1000) {
      safetyCount++;

      const shouldInclude = (() => {
        if (current < origin && !isSameDay(current, origin)) return false;

        switch (event.recurrence) {
          case 'daily':
            return true;
          case 'weekdays':
            return isWeekday(current);
          case 'monthly':
            return current.getDate() === origin.getDate();
          default:
            return false;
        }
      })();

      if (shouldInclude) {
        const diff = current.getTime() - origin.getTime();
        const newStart = new Date(event.date_start);
        newStart.setTime(newStart.getTime() + diff);

        const newEvent: Event = {
          ...event,
          id: event.id,
          date_start: newStart.toISOString(),
          date_end: event.date_end
            ? new Date(new Date(event.date_end).getTime() + diff).toISOString()
            : undefined,
        };


        if (!isSameDay(current, origin) || result.find(e => e.date_start === event.date_start)) {
          result.push(newEvent);
        } else {
          result.push(newEvent);
        }
      }

      switch (event.recurrence) {
        case 'daily':
        case 'weekdays':
          current.setDate(current.getDate() + 1);
          break;
        case 'monthly':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }
  }

  return result;
};