import React from "react";
import styles from "./DayScheduleModal.module.css";
import { X } from "lucide-react";

interface Task {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  date_start: string;
}

interface Event {
  id: number;
  title: string;
  date_start: string;
  date_end?: string;
  location?: string;
}

interface DayTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  tasks: Task[];
  events: Event[];
  onTaskClick: (task: Task) => void;
}

const DayTasksModal = ({
  isOpen,
  onClose,
  date,
  tasks,
  events,
  onTaskClick,
}: DayTasksModalProps) => {
  if (!isOpen) return null;

  const handleInternalTaskClick = (task: Task) => {
    onTaskClick(task);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <span className={styles.headerEyebrow}>Cronograma</span>
          <h3 className={styles.headerTitle}>
            {date?.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={16} />
          </button>
        </header>

        <div className={styles.modalBody}>
          <div className={styles.taskList}>
            {events.length > 0 || tasks.length > 0 ? (
              <>
                {events.map((event) => (
                  <div key={`event-${event.id}`} className={styles.taskItem}>
                    <div className={styles.taskTime}>
                      {new Date(event.date_start).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className={styles.taskContent}>
                      <span className={styles.taskTitle}>{event.title}</span>

                      <div className={styles.statusBadge}>Evento</div>
                    </div>
                  </div>
                ))}

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={styles.taskItem}
                    onClick={() => handleInternalTaskClick(task)}
                  >
                    <div className={styles.taskTime}>
                      {new Date(task.date_start).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className={styles.taskContent}>
                      <span className={styles.taskTitle}>{task.title}</span>

                      <div
                        className={`
              ${styles.statusBadge} 
              ${task.status === "todo" ? styles.badgePending : ""}
              ${task.status === "doing" ? styles.badgeProgress : ""}
              ${task.status === "done" ? styles.badgeDone : ""}
            `}
                      >
                        {task.status === "todo" && "Pendente"}
                        {task.status === "doing" && "Em andamento"}
                        {task.status === "done" && "Concluída"}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className={styles.emptyMessage}>
                Nenhuma tarefa para este dia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayTasksModal;
