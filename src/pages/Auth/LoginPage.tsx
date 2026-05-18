import styles from "../../components/Modal/Modal.module.css";
import LoginForm from "../../components/User/LoginForm";

const LoginPage = () => {
  return (
    <div className={styles.modal} style={{ position: "fixed", inset: 0 }}>
      <div
        className={`${styles.modalContainer} ${styles.authModalContainer}`}
        role="main"
      >
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
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
