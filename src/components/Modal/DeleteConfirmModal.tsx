import React from "react";
import styles from "./DeleteConfirmModal.module.css";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContainer}>
        <div className={styles.headerActions}>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalHeader}>
          <div className={styles.warningIcon}>
            <AlertTriangle size={32} />
          </div>
          <h2 className={styles.headerTitle}>Excluir</h2>
        </div>

        <div className={styles.modalBody}>
          <p>
            Você tem certeza que deseja excluir <strong>{title}</strong>?
          </p>
          <p className={styles.warningText}>Esta ação não pode ser desfeita.</p>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
