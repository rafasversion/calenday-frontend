import React, { useRef, useEffect, useState } from "react";
import styles from "./Calendar.module.css";
import { Plus, CalendarDays, SquareKanban, List } from "lucide-react";
import { CalendarViewMode } from "./Calendar";
import NotificationBell from "../Notifications/NotificationBell";
import ProfileDropdown from "../User/ProfileDropdown";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  calViewMode: CalendarViewMode;
  setCalViewMode: (mode: CalendarViewMode) => void;
  onCreateEvent: () => void;
  onCreateTask: () => void;
}

const CalendarHeader = ({ calViewMode, setCalViewMode }: Props) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = location.pathname.split("/").pop();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowCreateMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.sectionHeader}>
      <div className={styles.headerLeft}>
        <NotificationBell />
        <ProfileDropdown />
      </div>

      <div className={styles.headerActions}>
        <div className={styles.createMenuWrapper} ref={ref}>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateMenu((v) => !v)}
          >
            <Plus size={15} /> Criar
          </button>

          {showCreateMenu && (
            <div className={styles.createMenu}>
              <button
                className={styles.createMenuItem}
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate("/events/new");
                }}
              >
                <CalendarDays size={14} /> Evento
              </button>

              <button
                className={styles.createMenuItem}
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate("/tasks/new");
                }}
              >
                <List size={14} /> Tarefa
              </button>
            </div>
          )}
        </div>

        {currentView === "calendar" && (
          <select
            className={styles.calViewSelect}
            value={calViewMode}
            onChange={(e) => setCalViewMode(e.target.value as CalendarViewMode)}
          >
            <option value="month">Mensal</option>
            <option value="week">Semanal</option>
            <option value="day">Diário</option>
          </select>
        )}

        <div className={styles.generalViewBtns}>
          <button
            className={`${styles.generalViewBtn} ${currentView === "calendar" ? styles.generalViewBtnActive : ""}`}
            onClick={() => navigate("/dashboard/calendar")}
            title="Calendário"
          >
            <CalendarDays size={16} />
          </button>

          <button
            className={`${styles.generalViewBtn} ${currentView === "kanban" ? styles.generalViewBtnActive : ""}`}
            onClick={() => navigate("/dashboard/kanban")}
            title="Kanban"
          >
            <SquareKanban size={16} />
          </button>

          <button
            className={`${styles.generalViewBtn} ${currentView === "tasks" ? styles.generalViewBtnActive : ""}`}
            onClick={() => navigate("/dashboard/tasks")}
            title="Tarefas"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
