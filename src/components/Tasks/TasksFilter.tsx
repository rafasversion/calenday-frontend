import React from "react";
import styles from "./Tasks.module.css";
import { useDateRange } from "../../hooks/useDateRange";
import {
  Search,
  CalendarDays,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

interface FilterProps {
  onAddTask: () => void;
  filters: {
    text: string;
    status: string;
    date_start?: string;
    date_end?: string;
  };
  setFilters: (filters: any) => void;
  onApply: () => void;
}

const TasksFilter = ({
  onAddTask,
  filters,
  setFilters,
  onApply,
}: FilterProps) => {
  const {
    containerRef,
    isOpen,
    setIsOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    displayValue,
    apply,
  } = useDateRange();

  return (
    <div className={styles.tasksFilter}>
      <div className={styles.filterHeader}>
        <button className={styles.filterButtonAdd} onClick={onAddTask}>
          Adicionar Tarefa +
        </button>

        <form
          className={styles.tableFilter}
          onSubmit={(e) => {
            e.preventDefault();
            onApply();
          }}
        >
          <div className={styles.searchWrapper}>
            <Search size={15} className={styles.searchIcon} />
            <input
              className={styles.filterText}
              type="text"
              placeholder="Buscar tarefa..."
              value={filters.text}
              onChange={(e) => setFilters({ ...filters, text: e.target.value })}
            />
          </div>

          <div className={styles.filterDate} ref={containerRef}>
            <div
              className={styles.dateInputWrapper}
              onClick={() => setIsOpen(!isOpen)}
            >
              <CalendarDays size={15} className={styles.dateIcon} />
              <input
                type="text"
                readOnly
                placeholder="Filtrar por período"
                value={displayValue}
                className={styles.filterDateInput}
              />
            </div>
            {isOpen && (
              <div className={styles.filterDateRange}>
                <div className={styles.dateInputsGroup}>
                  <label>De</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <label>Até</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    apply();
                    setFilters({
                      ...filters,
                      date_start: startDate,
                      date_end: endDate,
                    });
                  }}
                  className={styles.applyDateBtn}
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>

          <div className={styles.selectWrapper}>
            <select
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="Todas">Todas</option>
              <option value="done">Concluída</option>
              <option value="todo">Pendente</option>
              <option value="doing">Em andamento</option>
            </select>
            <ChevronDown size={14} className={styles.selectIcon} />
          </div>

          <button
            type="submit"
            className={styles.filterButtonFilter}
            title="Filtrar"
          >
            <SlidersHorizontal size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TasksFilter;
