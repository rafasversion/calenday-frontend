import React, { useState, useEffect, useRef, useContext } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileDropdown.module.css";
import { UserContext } from "../../contexts/UserContext";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logoutAction } = useContext(UserContext);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.userBtn}
        onClick={() => setOpen((v) => !v)}
        title="Perfil"
      >
        <User size={22} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button
            className={styles.item}
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
          >
            Ver perfil
          </button>

          <div className={styles.divider} />

          <button
            className={`${styles.item} ${styles.logout}`}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
