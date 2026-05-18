import styles from "./Modal.module.css";

type Tab = "login" | "register";

interface ModalTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const ModalTabs = ({ activeTab, onTabChange }: ModalTabsProps) => {
  return (
    <div className={styles.modalTabs}>
      <button
        className={`${styles.modalTab} ${activeTab === "login" ? `${styles.modalTabActive}` : ""}`}
        onClick={() => onTabChange("login")}
        type="button"
      >
        Log in
      </button>
      <button
        className={`${styles.modalTab} ${activeTab === "register" ? `${styles.modalTabActive}` : ""}`}
        onClick={() => onTabChange("register")}
        type="button"
      >
        Cadastro
      </button>
    </div>
  );
};

export default ModalTabs;
