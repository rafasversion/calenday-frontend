import { useState } from "react";
import styles from "./Modal.module.css";
import ModalTabs from "./ModalTabs";
import LoginForm from "../User/LoginForm";
import RegisterForm from "../User/RegisterForm";

type Tab = "login" | "register";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />

      <div className={styles.modalContainer} role="dialog" aria-modal="true">
        <div className={`${styles.modalSide} ${styles.modalSideInfo}`}>
          <h2 className={styles.modalTitle}>
            Calen<span>day</span>
          </h2>

          <p className={styles.modalDescription}>
            Calenday é uma plataforma de organização criada para transformar
            planejamento em execução.
          </p>

          <ul className={styles.modalFeatures}>
            <li>Controle por calendário</li>
            <li>Organização visual</li>
            <li>Fluxo de tarefas intuitivo</li>
          </ul>
        </div>

        <div className={`${styles.modalSide} ${styles.modalSideContent}`}>
          <ModalTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div>
            {activeTab === "login" ? (
              <LoginForm />
            ) : (
              <RegisterForm
                onSuccess={() => {
                  setActiveTab("login");
                }}
              />
            )}
          </div>
        </div>

        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
