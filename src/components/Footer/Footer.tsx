import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h2 className={styles.footerBrand}>
            Calen<span>day</span>
          </h2>
          <ul className={styles.footerList}>
            <li className={styles.footerItem}>Sobre nós</li>
            <li className={styles.footerItem}>Contato</li>
            <li className={styles.footerItem}>Ferramentas</li>
          </ul>
          <span className={styles.footerCopy}>
            © 2026. Todos os direitos reservados.{" "}
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
