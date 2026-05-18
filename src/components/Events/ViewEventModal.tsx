import React, { useState } from "react";
import styles from "./ViewEventModal.module.css";
import { X, Calendar, MapPinned, FileText, Pencil, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../Modal/DeleteConfirmModal";
import { eventService } from "../../services/eventService";

interface Event {
  id: number;
  title: string;
  description?: string;
  date_start: string;
  date_end?: string;
  location?: string;
  color?: string;
}

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit: (event: Event) => void;
  onDeleteSuccess: () => void;
}

const ViewEventModal = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onDeleteSuccess,
}: ViewEventModalProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen || !event) return null;

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
    const success = await eventService.delete(event.id);
    if (success) {
      setIsDeleteModalOpen(false);
      onDeleteSuccess();
      onClose();
    }
  };

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalOverlay} onClick={onClose} />

        <div className={styles.modalContainer}>
          <div
            className={styles.modalHeader}
            style={{ background: event.color || "var(--primary)" }}
          >
            <div className={styles.headerActions}>
              <button
                className={styles.actionButton}
                onClick={() => onEdit(event)}
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

              <button className={styles.modalClose} onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            <span className={styles.headerEyebrow}>Evento</span>
            <h2 className={styles.headerTitle}>{event.title}</h2>
          </div>

          <div className={styles.modalBody}>
            <div className={`${styles.dataBlock} ${styles.full}`}>
              <span className={styles.dataLabel}>
                <FileText size={12} /> Descrição
              </span>
              <p className={styles.dataDesc}>
                {event.description || "Sem descrição."}
              </p>
            </div>

            <hr className={styles.divider} />

            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <Calendar size={12} /> Início
              </span>
              <p className={styles.dataValue}>{formatDate(event.date_start)}</p>
            </div>

            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <Calendar size={12} /> Fim
              </span>
              <p className={styles.dataValue}>
                {formatDate(event.date_end || event.date_start)}
              </p>
            </div>

            <div className={styles.dataBlock}>
              <span className={styles.dataLabel}>
                <MapPinned size={12} /> Local
              </span>
              <p className={styles.dataValue}>
                {event.location || "Não informado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={event.title}
      />
    </>
  );
};

export default ViewEventModal;
