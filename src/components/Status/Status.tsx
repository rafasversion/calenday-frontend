import React from "react";
import styles from "./Status.module.css";

interface StatusProps {
  tasks: { status: string }[];
}

const Status = ({ tasks }: StatusProps) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "todo").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <section className={styles.status}>
      <div className={styles.statusHeader}>
        <h2 className={styles.statusTitle}>Status</h2>
      </div>

      <div className={styles.statusCards}>
        <div className={styles.statusCard}>
          <h3 className={styles.statusHeading}>Total</h3>
          <span className={styles.statusNumber}>{total}</span>
        </div>
        <div className={styles.statusCard}>
          <h3 className={styles.statusHeading}>Pendentes</h3>
          <span className={styles.statusNumber}>{pending}</span>
        </div>
        <div className={styles.statusCard}>
          <h3 className={styles.statusHeading}>Concluídas</h3>
          <span className={styles.statusNumber}>{done}</span>
        </div>
        <div className={styles.statusCard}>
          <h3 className={styles.statusHeading}>Progresso</h3>
          <span className={styles.statusNumber}>{progress}%</span>
        </div>
      </div>
    </section>
  );
};

export default Status;
