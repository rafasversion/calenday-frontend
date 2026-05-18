import React, { useState, useMemo, useEffect } from "react";
import styles from "./Calendar.module.css";
import { MoveLeft, MoveRight } from "lucide-react";
import DayScheduleModal from "./DayScheduleModal";

export type CalendarViewMode = "month" | "week" | "day";
export type GeneralViewMode = "calendar" | "kanban" | "table";

interface Task {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  date_start: string;
  date_end?: string;
}

interface CalEvent {
  id: number;
  title: string;
  description?: string;
  date_start: string;
  date_end?: string;
  color?: string;
  location?: string;
  recurrence?: "none" | "daily" | "weekdays" | "monthly";
}

interface CalendarProps {
  tasks?: Task[];
  events?: CalEvent[];
  onTaskClick?: (task: Task) => void;
  onEventClick?: (event: CalEvent) => void;
  calViewMode: CalendarViewMode;
}

const STATUS_COLORS: Record<string, string> = {
  todo: "rgba(201, 0, 0, 0.5)",
  doing: "#e49310",
  done: "rgba(142, 151, 104, 0.8)",
};

const DEFAULT_EVENT_COLOR = "#8a9b65";
const HOUR_HEIGHT = 60;

const WEEK_DAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const WEEK_DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

const fmtTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const getTimeBlockStyle = (item: { date_start: string; date_end?: string }) => {
  const start = new Date(item.date_start);
  const end = item.date_end
    ? new Date(item.date_end)
    : new Date(start.getTime() + 3600000);

  const startMins = start.getHours() * 60 + start.getMinutes();
  const endMins = end.getHours() * 60 + end.getMinutes();

  return {
    top: `${(startMins / 60) * HOUR_HEIGHT}px`,
    height: `${Math.max(((endMins - startMins) / 60) * HOUR_HEIGHT, 24)}px`,
  };
};

const getTimeRange = (item: { date_start: string; date_end?: string }) => {
  const start = new Date(item.date_start);
  if (!item.date_end) return fmtTime(start);
  const end = new Date(item.date_end);
  return `${fmtTime(start)} – ${fmtTime(end)}`;
};

const isWeekday = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

const expandRecurringEvents = (
  events: CalEvent[],
  viewStart: Date,
  viewEnd: Date,
): CalEvent[] => {
  const result: CalEvent[] = [];

  for (const event of events) {
    if (!event.recurrence || event.recurrence === "none") {
      result.push(event);
      continue;
    }

    const origin = new Date(event.date_start);
    const loopStart = new Date(Math.max(origin.getTime(), viewStart.getTime()));
    loopStart.setHours(origin.getHours(), origin.getMinutes(), 0, 0);

    const current = new Date(loopStart);
    let safety = 0;

    while (current <= viewEnd && safety < 1000) {
      safety++;
      const shouldInclude = (() => {
        switch (event.recurrence) {
          case "daily":
            return true;
          case "weekdays":
            return isWeekday(current);
          case "monthly":
            return current.getDate() === origin.getDate();
          default:
            return false;
        }
      })();

      if (shouldInclude) {
        const diff = current.getTime() - origin.getTime();
        result.push({
          ...event,
          date_start: new Date(
            new Date(event.date_start).getTime() + diff,
          ).toISOString(),
          date_end: event.date_end
            ? new Date(new Date(event.date_end).getTime() + diff).toISOString()
            : undefined,
        });
      }

      switch (event.recurrence) {
        case "daily":
        case "weekdays":
          current.setDate(current.getDate() + 1);
          break;
        case "monthly":
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }
  }
  return result;
};

const Calendar = ({
  tasks = [],
  events = [],
  onTaskClick,
  onEventClick,
  calViewMode,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const shortTitle = (title: string) => {
    if (!isMobile) return title;
    const words = title.trim().split(" ");
    return words.length > 1 ? words[0] + "..." : title;
  };

  const changeDate = (step: number) => {
    const d = new Date(currentDate);
    if (calViewMode === "month") d.setMonth(d.getMonth() + step);
    else if (calViewMode === "week") d.setDate(d.getDate() + step * 7);
    else d.setDate(d.getDate() + step);
    setCurrentDate(d);
  };

  const expandedEvents = useMemo(() => {
    const viewStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const viewEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      0,
    );
    return expandRecurringEvents(events, viewStart, viewEnd);
  }, [events, currentDate]);

  const getTasksForDay = (date: Date) =>
    tasks.filter((t) => t.date_end && isSameDay(new Date(t.date_end), date));

  const getEventsForDay = (date: Date) =>
    expandedEvents.filter((e) => isSameDay(new Date(e.date_start), date));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const headerLabel = useMemo(() => {
    const year = currentDate.getFullYear();
    if (calViewMode === "month" || calViewMode === "week") {
      return `${currentDate.toLocaleString("pt-BR", { month: "long" })} de ${year}`;
    }
    return currentDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [currentDate, calViewMode]);

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const cells: React.ReactNode[] = [];

    WEEK_DAYS.forEach((wd, i) =>
      cells.push(
        <div key={wd} className={styles.monthWeekdayHeader}>
          <span className={styles.weekNameFull}>{wd}</span>
          <span className={styles.weekNameShort}>{WEEK_DAYS_SHORT[i]}</span>
        </div>,
      ),
    );

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e${i}`} className={styles.monthDayEmpty} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayEvents = getEventsForDay(date);
      const dayTasks = getTasksForDay(date);
      const isToday = isSameDay(date, today);

      cells.push(
        <div
          key={d}
          className={`${styles.monthDay} ${isToday ? styles.monthDayToday : ""}`}
          onClick={() => handleDayClick(date)}
        >
          <span className={styles.monthDayNumber}>{d}</span>
          <div className={styles.monthDayItems}>
            {dayEvents.map((ev, i) => (
              <div
                key={`${ev.id}-${i}`}
                className={styles.monthEventChip}
                style={{ background: ev.color || DEFAULT_EVENT_COLOR }}
                title={ev.title}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(ev);
                }}
              >
                {shortTitle(ev.title)}
              </div>
            ))}
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className={styles.monthTaskChip}
                title={task.title}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick?.(task);
                }}
              >
                <span
                  className={styles.monthTaskDot}
                  style={{ background: STATUS_COLORS[task.status] }}
                />
                <span className={task.status === "done" ? styles.taskDone : ""}>
                  {shortTitle(task.title)}
                </span>
              </div>
            ))}
          </div>
        </div>,
      );
    }
    return cells;
  };

  const renderTimeGrid = (days: Date[], hideHeaders = false) => {
    const isDayView = hideHeaders;
    return (
      <div
        className={`${styles.timeGridWrapper} ${isDayView ? styles.dayTimeGridWrapper : ""}`}
      >
        {!hideHeaders && (
          <div className={styles.timeGridHeaders}>
            <div />
            {days.map((day, i) => (
              <div key={i} className={styles.timeGridDayHeader}>
                <span className={styles.weekNameFull}>
                  {WEEK_DAYS[day.getDay()]}
                </span>
                <span className={styles.weekNameShort}>
                  {WEEK_DAYS_SHORT[day.getDay()]}
                </span>
                <span>{day.getDate()}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`${styles.timeGridScroll} ${isDayView ? styles.dayTimeGridScroll : ""}`}
        >
          <div
            className={styles.timeGrid}
            style={{ height: `${24 * HOUR_HEIGHT}px` }}
          >
            <div className={styles.timeGutterCol}>
              {HOURS.map((h) => (
                <div key={h} className={styles.hourLabel}>
                  {h > 0 ? `${h}:00` : ""}
                </div>
              ))}
            </div>

            {days.map((day, idx) => (
              <div key={idx} className={styles.dayColumn}>
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className={styles.hourLine}
                    style={{ top: h * HOUR_HEIGHT }}
                  />
                ))}

                {getEventsForDay(day).map((ev, i) => (
                  <div
                    key={`${ev.id}-${i}`}
                    className={styles.timeEventBlock}
                    style={{
                      ...getTimeBlockStyle(ev),
                      background: ev.color || DEFAULT_EVENT_COLOR,
                    }}
                    title={ev.title}
                    onClick={() => onEventClick?.(ev)}
                  >
                    <div className={styles.timeBlockTitle}>
                      {shortTitle(ev.title)}
                    </div>
                    <div className={styles.timeBlockTime}>
                      {getTimeRange(ev)}
                    </div>
                  </div>
                ))}

                <div className={styles.dayTasksInline}>
                  {getTasksForDay(day).map((task) => (
                    <div
                      key={task.id}
                      className={styles.monthTaskChip}
                      title={task.title}
                      onClick={() => onTaskClick?.(task)}
                    >
                      <span
                        className={styles.monthTaskDot}
                        style={{ background: STATUS_COLORS[task.status] }}
                      />
                      <span
                        className={
                          task.status === "done" ? styles.taskDone : ""
                        }
                      >
                        {shortTitle(task.title)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.calendarSection}>
      <div className={styles.calendarContent}>
        <div className={styles.calNavHeader}>
          <button className={styles.navBtn} onClick={() => changeDate(-1)}>
            <MoveLeft size={40} />
          </button>
          {calViewMode === "day" ? (
            <div className={styles.dayNavLabel}>
              <span className={styles.dayNavDate}>
                {currentDate.toLocaleDateString("pt-BR")}
              </span>
              <span className={styles.dayNavWeekday}>
                {WEEK_DAYS[currentDate.getDay()]}
              </span>
            </div>
          ) : (
            <span className={styles.calNavTitle}>{headerLabel}</span>
          )}
          <button className={styles.navBtn} onClick={() => changeDate(1)}>
            <MoveRight size={40} />
          </button>
        </div>

        {calViewMode === "month" && (
          <div className={styles.monthGrid}>{renderMonthView()}</div>
        )}
        {calViewMode === "week" &&
          renderTimeGrid(
            Array.from({ length: 7 }, (_, i) => {
              const d = getStartOfWeek(currentDate);
              d.setDate(d.getDate() + i);
              return d;
            }),
          )}
        {calViewMode === "day" && renderTimeGrid([currentDate], true)}
      </div>

      <DayScheduleModal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        date={selectedDate}
        tasks={selectedDate ? getTasksForDay(selectedDate) : []}
        events={selectedDate ? getEventsForDay(selectedDate) : []}
        onTaskClick={onTaskClick!}
      />
    </section>
  );
};

export default Calendar;
