import styles from "./Highlight.module.css";

const features = [
  "Calendário Mensal",
  "Visualização Semanal",
  "Visualização Diária",
  "Kanban",
  "Gestão de Tarefas",
  "Eventos",
];

const Highlight = () => {
  return (
    <section className={styles.highlight}>
      <h1 className={styles.highlightTitle}>
        Tudo que você precisa para organizar suas tarefas<span>.</span>
      </h1>
      <p className={styles.highlightDescription}>
        Ferramentas visuais, simples e pensadas para o seu dia a dia.
      </p>
      <div className={styles.highlightTags}>
        {features.map((f) => (
          <span key={f} className={styles.tag}>
            {f}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Highlight;
