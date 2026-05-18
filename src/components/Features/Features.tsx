import styles from "./Features.module.css";

import calendarMonthImg from "../../assets/img/calendar-month.png";
import calendarWeekImg from "../../assets/img/calendar-week.png";
import tasksImg from "../../assets/img/tasks.png";
import kanbanImg from "../../assets/img/kanban.png";

const featuresData = [
  {
    type: "Calendário",
    title: "Visualize sua rotina com clareza",
    description:
      "Navegue entre as visualizações mensal, semanal e diária. Veja eventos e tarefas distribuídos no tempo e nunca perca um prazo importante.",
    image: calendarMonthImg,
    alt: "Calendário mensal com eventos",
    badges: ["Mensal", "Semanal", "Diário"],
  },
  {
    type: "Tarefas",
    title: "Controle total sobre o que fazer",
    description:
      "Crie tarefas com título, descrição, prioridade, tags e datas. Filtre por status, período ou nome e acompanhe o progresso geral com indicadores visuais.",
    image: tasksImg,
    alt: "Lista de tarefas com status e prioridade",
    badges: ["Prioridade", "Tags", "Filtros"],
  },
  {
    type: "Kanban",
    title: "Fluxo visual do início ao fim",
    description:
      "Organize suas tarefas em colunas de Pendente, Em Andamento e Concluída. Ideal para visualizar o fluxo de trabalho e manter o foco.",
    image: kanbanImg,
    alt: "Board kanban com colunas de status",
    badges: ["Pendente", "Em Andamento", "Concluída"],
  },
  {
    type: "Eventos",
    title: "Agenda e compromissos integrados",
    description:
      "Cadastre eventos com horário de início e fim e visualize tudo junto às suas tarefas no calendário. Uma visão completa da sua semana.",
    image: calendarWeekImg,
    alt: "Visualização semanal com eventos agendados",
    badges: ["Agenda", "Horários", "Recorrência"],
  },
];

const Features = () => {
  return (
    <section id="features" className={styles.featuresOuter}>
      {featuresData.map((feature, index) => {
        const isReversed = index % 2 !== 0;
        return (
          <div
            className={`${styles.featuresCard} ${isReversed ? styles.featuresCardReversed : ""}`}
            key={index}
          >
            <div className={styles.featuresContent}>
              <span className={styles.featuresType}>{feature.type}</span>
              <h2 className={styles.featuresTitle}>{feature.title}</h2>
              <p className={styles.featuresDescription}>
                {feature.description}
              </p>
              <div className={styles.featuresBadges}>
                {feature.badges.map((badge) => (
                  <span key={badge} className={styles.badge}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.featuresImage}>
              <div className={styles.screenshotFrame}>
                <img src={feature.image} alt={feature.alt} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Features;
