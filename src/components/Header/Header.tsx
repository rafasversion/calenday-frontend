import React from "react";
import styles from "./Header.module.css";
import Navbar from "./Navbar";
import calendarImg from "../../assets/img/calendar-month.png";

interface HeaderProps {
  onOpenModal?: () => void;
}

const Header = ({ onOpenModal }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Navbar onOpenModal={onOpenModal} />
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              Produtividade estruturada para o seu dia a dia<span>.</span>
            </h2>
            <p className={styles.heroDescription}>
              Centralize tarefas, acompanhe prazos e mantenha sua rotina sob
              controle com uma experiência simples e eficiente.
            </p>
            <button className={styles.heroButton} onClick={onOpenModal}>
              Comece agora
            </button>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.mockupContainer}>
              <div className={styles.mockupWrapper}>
                <div className={styles.browserWindow}>
                  <div className={styles.screenshotWrapper}>
                    <img
                      src={calendarImg}
                      alt="Interface do aplicativo"
                      className={styles.screenshotImage}
                    />
                    <div className={styles.screenshotOverlay}></div>
                  </div>
                </div>
                <div className={styles.mockupShadow}></div>
              </div>
              <div className={styles.decorativeBlobOne}></div>
              <div className={styles.decorativeBlobTwo}></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
