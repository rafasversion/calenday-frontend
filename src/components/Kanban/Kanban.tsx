import React, { useState, useEffect, useRef } from "react";
import styles from "../Kanban/Kanban.module.css";
import { taskService } from "../../services/taskService";

interface Task {
  id: number;
  title: string;
  status: "todo" | "doing" | "done";
  date_start: string;
}

interface Props {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onStatusChange?: () => void;
}

const STATUS_COLORS = {
  todo: "rgba(201, 0, 0, 0.5)",
  doing: "#e49310",
  done: "rgba(142, 151, 104, 0.8)",
};

const Kanban = ({ tasks, onTaskClick, onStatusChange }: Props) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [dragging, setDragging] = useState<Task | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [overCol, setOverCol] = useState<"todo" | "doing" | "done" | null>(
    null,
  );
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hasMoved = useRef(false);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const groups = [
    { key: "todo" as const, label: "Pendente" },
    { key: "doing" as const, label: "Em andamento" },
    { key: "done" as const, label: "Concluída" },
  ];

  const getColUnderMouse = (x: number, y: number) => {
    for (const group of groups) {
      const el = colRefs.current[group.key];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return group.key;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent, task: Task) => {
    if (e.button !== 0) return;
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCardSize({ w: rect.width, h: rect.height });
    setMousePos({ x: e.clientX, y: e.clientY });
    hasMoved.current = false;
    setDragging(task);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      hasMoved.current = true;
      setMousePos({ x: e.clientX, y: e.clientY });
      setOverCol(getColUnderMouse(e.clientX, e.clientY));
    };

    const onUp = async (e: MouseEvent) => {
      const col = getColUnderMouse(e.clientX, e.clientY);

      if (!hasMoved.current) {
        onTaskClick?.(dragging);
        setDragging(null);
        setOverCol(null);
        return;
      }

      setDragging(null);
      setOverCol(null);

      if (!col || col === dragging.status) return;

      const prev = dragging;
      setLocalTasks((t) =>
        t.map((x) => (x.id === prev.id ? { ...x, status: col } : x)),
      );

      try {
        await taskService.update(prev.id, { status: col });
        onStatusChange?.();
      } catch {
        setLocalTasks((t) =>
          t.map((x) => (x.id === prev.id ? { ...x, status: prev.status } : x)),
        );
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  return (
    <>
      <div className={styles.kanbanGrid}>
        {groups.map(({ key, label }) => (
          <div
            key={key}
            ref={(el) => {
              colRefs.current[key] = el;
            }}
            className={`${styles.kanbanCol} ${overCol === key ? styles.kanbanColOver : ""}`}
          >
            <div className={styles.kanbanColHeader}>{label}</div>
            <div className={styles.kanbanCards}>
              {localTasks
                .filter((t) => t.status === key)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`${styles.kanbanCard} ${dragging?.id === task.id ? styles.kanbanCardGhost : ""}`}
                    style={{ borderColor: STATUS_COLORS[key] }}
                    onMouseDown={(e) => handleMouseDown(e, task)}
                  >
                    <div
                      className={styles.kanbanCardDate}
                      style={{ background: STATUS_COLORS[key] }}
                    >
                      {new Date(task.date_start).toLocaleDateString("pt-BR")}
                    </div>
                    <div className={styles.kanbanCardTitle}>{task.title}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {dragging && hasMoved.current && (
        <div
          className={styles.kanbanCardFloating}
          style={{
            width: cardSize.w,
            height: cardSize.h,
            left: mousePos.x - dragOffset.current.x,
            top: mousePos.y - dragOffset.current.y,
            borderColor: STATUS_COLORS[dragging.status],
          }}
        >
          <div
            className={styles.kanbanCardDate}
            style={{ background: STATUS_COLORS[dragging.status] }}
          >
            {new Date(dragging.date_start).toLocaleDateString("pt-BR")}
          </div>
          <div className={styles.kanbanCardTitle}>{dragging.title}</div>
        </div>
      )}
    </>
  );
};

export default Kanban;
