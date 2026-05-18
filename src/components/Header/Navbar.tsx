import React, { useState } from "react";
import styles from "./Header.module.css";

interface NavbarProps {
  onOpenModal?: () => void;
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Navbar = ({ onOpenModal }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const handleNav = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.navbarBrand}>
        Calen<span>day</span>
      </h1>

      <ul className={styles.navbarList}>
        <li>
          <button
            className={styles.navbarLink}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={styles.navbarLink}
            onClick={() => scrollTo("features")}
          >
            Ferramentas
          </button>
        </li>
        <li>
          <button
            className={styles.navbarLink}
            onClick={() => scrollTo("steps")}
          >
            Como funciona
          </button>
        </li>
        <button className={styles.navbarLogin} onClick={onOpenModal}>
          Log in
        </button>
      </ul>

      <button
        className={styles.hamburger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        <span className={`${styles.bar} ${open ? styles.barOpen1 : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen2 : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen3 : ""}`} />
      </button>

      {open && (
        <div className={styles.mobileMenu}>
          <button
            className={styles.mobileLink}
            onClick={() =>
              handleNav(() => window.scrollTo({ top: 0, behavior: "smooth" }))
            }
          >
            Home
          </button>
          <button
            className={styles.mobileLink}
            onClick={() => handleNav(() => scrollTo("features"))}
          >
            Ferramentas
          </button>
          <button
            className={styles.mobileLink}
            onClick={() => handleNav(() => scrollTo("steps"))}
          >
            Como funciona
          </button>
          <button
            className={styles.mobileLoginBtn}
            onClick={() => {
              setOpen(false);
              onOpenModal?.();
            }}
          >
            Log in
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
