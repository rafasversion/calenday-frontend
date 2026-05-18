import styles from "./Steps.module.css";

const stepsData = [
  {
    number: "1",
    heading: "Crie uma conta",
    text: "Cadastre com seu e-mail e senha ou use sua conta do Google.",
  },
  {
    number: "2",
    heading: "Adicione tarefas e eventos",
    text: "Preencha título, descrição, data e horário, prioridade, anexos e tags.",
  },
  {
    number: "3",
    heading: "Escolha sua visualização",
    text: "Calendário mensal, semanal ou diário. Visualize melhor suas tarefas com o quadro Kanban ou na tela de controle.",
  },
  {
    number: "4",
    heading: "Acompanhe o progresso",
    text: "Na tela de controle de tarefas você vê o que foi feito, o que está pendente e quanto falta para concluir.",
  },
];

const Steps = () => {
  return (
    <section id="steps" className={styles.steps}>
      <h2 className={styles.stepsTitle}>Comece em poucos passos.</h2>
      <div className={styles.stepsList}>
        {stepsData.map((step, index) => (
          <>
            <article className={styles.stepsItem} key={step.number}>
              <span className={styles.stepsNumber}>{step.number}</span>
              <h3 className={styles.stepsHeading}>{step.heading}</h3>
              <p className={styles.stepsText}>{step.text}</p>
            </article>
            {index < stepsData.length - 1 && (
              <div className={styles.stepsArrow} aria-hidden="true">
                →
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
};

export default Steps;
