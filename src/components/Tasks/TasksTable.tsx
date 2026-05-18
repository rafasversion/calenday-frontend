import React, { useState, useMemo } from "react";
import TasksFilter from "./TasksFilter";
import ViewTaskModal from "./ViewTaskModal";
import DeleteConfirmModal from "../Modal/DeleteConfirmModal";
import styles from "./Tasks.module.css";
import { RotateCw, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type TaskStatus = "todo" | "doing" | "done";
type TaskPriority = "low" | "medium" | "high";
type SortField = "title" | "date_start" | "priority" | "status" | null;
type SortDir = "asc" | "desc";

interface TaskData {
  id: number;
  title: string;
  description: string;
  date_start: string;
  date_end?: string;
  status: TaskStatus;
  priority: TaskPriority;
  isRecurrent?: boolean;
  tags: { id: number; name: string }[];
  attachments?: { id: number; url: string; type: string }[];
}

interface TasksTableProps {
  tasks: TaskData[];
  onFilterUpdate: (filters: any) => void;
  onAddTask: () => void;
  onEditTask: (task: TaskData) => void;
  onDeleteTask: (id: number) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  done: { label: "Concluída", color: "#8e9768" },
  doing: { label: "Em andamento", color: "#e49310" },
  todo: { label: "Pendente", color: "#e47c78" },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> =
  {
    high: { label: "Alta", color: "#c90000" },
    medium: { label: "Média", color: "#e49310" },
    low: { label: "Baixa", color: "#8e9768" },
  };

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const STATUS_ORDER: Record<TaskStatus, number> = {
  todo: 0,
  doing: 1,
  done: 2,
};

const PAGE_SIZE = 10;

const TasksTable = ({
  tasks,
  onFilterUpdate,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TasksTableProps) => {
  const [localFilters, setLocalFilters] = useState({
    text: "",
    status: "Todas",
    date_start: "",
    date_end: "",
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskData | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const handleViewTask = (task: TaskData) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown size={16} style={{ opacity: 0.4 }} />;
    }

    return sortDir === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    const d = new Date(date);

    return (
      d.toLocaleDateString("pt-BR") +
      ", " +
      d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const sorted = useMemo(() => {
    if (!sortField) return tasks;

    return [...tasks].sort((a, b) => {
      let cmp = 0;

      if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else if (sortField === "date_start") {
        cmp =
          new Date(a.date_start).getTime() - new Date(b.date_start).getTime();
      } else if (sortField === "priority") {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      } else if (sortField === "status") {
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      }

      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [tasks, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const highlight = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <section className={styles.tasks}>
      <div className={styles.tasksHeader}>
        <h3 className={styles.tasksTitle}>Tarefas</h3>
      </div>

      <TasksFilter
        onAddTask={onAddTask}
        filters={localFilters}
        setFilters={(f: any) => {
          setLocalFilters(f);
          setPage(1);
        }}
        onApply={() => {
          onFilterUpdate(localFilters);
          setPage(1);
        }}
      />

      <div className={styles.tasksList}>
        {tasks.length > 0 ? (
          <>
            <table
              className={`${styles.tasksTable} ${
                totalPages <= 1 ? styles.noPaginationMargin : ""
              }`}
            >
              <thead className={styles.tasksTableHeader}>
                <tr>
                  <th
                    className={`${styles.tableHeadItem} ${styles.sortable}`}
                    onClick={() => handleSort("title")}
                  >
                    <div className={styles.sortableContent}>
                      Título <SortIcon field="title" />
                    </div>
                  </th>

                  <th
                    className={`${styles.tableHeadItem} ${styles.sortable}`}
                    onClick={() => handleSort("date_start")}
                  >
                    <div className={styles.sortableContent}>
                      Prazo <SortIcon field="date_start" />
                    </div>
                  </th>

                  <th
                    className={`${styles.tableHeadItem} ${styles.sortable}`}
                    onClick={() => handleSort("priority")}
                  >
                    <div className={styles.sortableContent}>
                      Prioridade <SortIcon field="priority" />
                    </div>
                  </th>

                  <th
                    className={`${styles.tableHeadItem} ${styles.sortable}`}
                    onClick={() => handleSort("status")}
                  >
                    <div className={styles.sortableContent}>
                      Status <SortIcon field="status" />
                    </div>
                  </th>

                  <th className={styles.tableHeadItem}>Tags</th>
                  <th></th>
                </tr>
              </thead>

              <tbody className={styles.tableContent}>
                {paginated.map((task) => {
                  const statusCfg = STATUS_CONFIG[task.status];
                  const priorityCfg = PRIORITY_CONFIG[task.priority];

                  return (
                    <tr key={task.id} className={styles.tableRow}>
                      <td
                        className={styles.tableContentItem}
                        data-label="Título"
                      >
                        {highlight(task.title, localFilters.text)}

                        {task.isRecurrent && (
                          <RotateCw
                            size={14}
                            style={{
                              marginLeft: 6,
                              verticalAlign: "middle",
                              opacity: 0.6,
                            }}
                          />
                        )}
                      </td>

                      <td
                        className={styles.tableContentItem}
                        data-label="Prazo"
                      >
                        {formatDate(task.date_start)}
                      </td>

                      <td
                        className={styles.tableContentItem}
                        data-label="Prioridade"
                      >
                        <span className={styles.dotRow}>
                          <span
                            className={styles.statusDot}
                            style={{ background: priorityCfg.color }}
                          />
                          {priorityCfg.label}
                        </span>
                      </td>

                      <td
                        className={styles.tableContentItem}
                        data-label="Status"
                      >
                        {statusCfg.label}
                      </td>

                      <td className={styles.tableContentItem} data-label="Tags">
                        <div
                          style={{ display: "flex", gap: 5, flexWrap: "wrap" }}
                        >
                          {task.tags.map((tag) => (
                            <span key={tag.id} className={styles.tableItemTag}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className={styles.tasksTableActions}>
                        <button
                          title="Ver detalhes"
                          onClick={() => handleViewTask(task)}
                        >
                          <i className="fa-solid fa-clipboard-list"></i>
                        </button>

                        <button title="Editar" onClick={() => onEditTask(task)}>
                          <i className="fa-solid fa-square-pen"></i>
                        </button>

                        <button
                          title="Excluir"
                          onClick={() => setTaskToDelete(task)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  <i className="fa-solid fa-angles-left"></i>
                </button>

                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <i className="fa-solid fa-angle-left"></i>
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={i} className={styles.pageEllipsis}>
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      className={`${styles.pageBtn} ${
                        page === p ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => setPage(p as number)}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noTasksMessage}>
            <i className="fa-solid fa-clipboard-list"></i>
            <p>Sem tarefas.</p>
          </div>
        )}
      </div>

      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={onEditTask}
        onDeleteSuccess={() => onFilterUpdate(localFilters)}
      />

      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        title={taskToDelete?.title || ""}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            onDeleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
      />
    </section>
  );
};

export default TasksTable;
