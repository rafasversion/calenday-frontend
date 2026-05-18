import React, { useState } from "react";
import styles from "./ViewTaskModal.module.css";
import {
  X,
  Calendar,
  Flag,
  Tag,
  FileText,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";
import DeleteConfirmModal from "../Modal/DeleteConfirmModal";
import { taskService } from "../../services/taskService";

const BASE_URL = import.meta.env.VITE_UPLOADS_URL;

interface ViewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onEdit: (task: any) => void;
  onDeleteSuccess: () => void;
}

const statusConfig = {
  done: { label: "Concluída", dot: "#d4f0a0" },
  doing: { label: "Em andamento", dot: "#ffe59e" },
  todo: { label: "Pendente", dot: "#e0e0d0" },
};

const priorityConfig = {
  low: { label: "Baixa", cls: "priorityLow" },
  medium: { label: "Média", cls: "priorityMedium" },
  high: { label: "Alta", cls: "priorityHigh" },
};

const ViewTaskModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDeleteSuccess,
}: ViewTaskModalProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen || !task) return null;

  const formatDate = (date: string) => {
    if (!date) return "Não definida";
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmDelete = async () => {
    const success = await taskService.delete(task.id);
    if (success) {
      setIsDeleteModalOpen(false);
      onDeleteSuccess();
      onClose();
    }
  };

  const handleEditClick = () => {
    onEdit(task);
  };

  const status = statusConfig[task.status as keyof typeof statusConfig];
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
  const hasFiles = task.attachments && task.attachments.length > 0;

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalOverlay} onClick={onClose} />
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            <div className={styles.headerActions}>
              <button
                className={styles.actionButton}
                onClick={handleEditClick}
                title="Editar"
              >
                <Pencil size={15} />
              </button>
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => setIsDeleteModalOpen(true)}
                title="Excluir"
              >
                <Trash2 size={15} />
              </button>
              <button
                className={styles.modalClose}
                onClick={onClose}
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>
            <span className={styles.headerEyebrow}>Tarefa</span>
            <h2 className={styles.headerTitle}>{task.title}</h2>
            {status && (
              <div className={styles.headerBadge}>
                <span
                  className={styles.badgeDot}
                  style={{ background: status.dot }}
                />
                {status.label}
              </div>
            )}
          </div>
          <div className={styles.modalBody}>
            <div className={`${styles.dataBlock} ${styles.full}`}>
              <span className={styles.dataLabel}>
                <FileText size={12} /> Descrição
              </span>
              <p className={styles.dataDesc}>
                {task.description || "Sem descrição."}
              </p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <Calendar size={12} /> Início
              </span>
              <p className={styles.dataValue}>{formatDate(task.date_start)}</p>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <Calendar size={12} /> Fim
              </span>
              <p className={styles.dataValue}>
                {formatDate(task.date_end || task.date_start)}
              </p>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <Tag size={12} /> Tags
              </span>
              <div className={styles.tagContainer}>
                {task.tags?.length ? (
                  task.tags.map((tag: any) => (
                    <span key={tag.id} className={styles.tagItem}>
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className={styles.emptyHint}>Nenhuma tag</span>
                )}
              </div>
            </div>
            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <Flag size={12} /> Prioridade
              </span>
              <p
                className={`${styles.dataValue} ${priority ? styles[priority.cls] : ""}`}
              >
                {priority?.label ?? "—"}
              </p>
            </div>
            {hasFiles && (
              <>
                <hr className={styles.divider} />
                <div className={`${styles.dataBlock} ${styles.full}`}>
                  <span className={styles.dataLabel}>
                    <Paperclip size={12} /> Arquivos
                  </span>
                  <ul className={styles.fileList}>
                    {task.attachments.map((file: any, i: number) => (
                      <li key={file.id ?? i}>
                        <a
                          href={`${BASE_URL}${file.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileItem}
                        >
                          <span className={styles.fileIcon}>
                            <FileText size={14} />
                          </span>
                          <span className={styles.fileName}>
                            {file.url.split("/").pop() ?? `arquivo-${i + 1}`}
                          </span>
                          <span className={styles.fileSize}>{file.type}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={task.title}
      />
    </>
  );
};

export default ViewTaskModal;
