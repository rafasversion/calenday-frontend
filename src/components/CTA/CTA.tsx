import styles from "./CTA.module.css";

interface CTAProps {
  onOpenModal: () => void;
}

const CTA = ({ onOpenModal }: CTAProps) => {
  return (
    <section className={styles.cta}>
      <p className={styles.ctaEyebrow}>Pronto para começar?</p>
      <h2 className={styles.ctaTitle}>
        Fique organizado e aumente sua produtividade.
      </h2>
      <p className={styles.ctaDescription}>
        Junte-se a quem já organiza tarefas, eventos e prazos em um só lugar.
        Gratuito, sem instalar nada.
      </p>
      <div className={styles.ctaActions}>
        <button
          className={styles.ctaButton}
          type="button"
          onClick={onOpenModal}
        >
          Comece agora
        </button>
      </div>
    </section>
  );
};

export default CTA;
