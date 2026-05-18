import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import EditProfile from "./EditProfile";
import DeleteConfirmModal from "../Modal/DeleteConfirmModal";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await userService.getProfile();
      setUser(data);
    };
    load();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteProfile();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  if (!user) return null;

  const initials = (user.name || user.username || "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <span className={styles.backArrow}>←</span>
          Voltar
        </button>

        <div className={styles.header}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.headerText}>
            <h1 className={styles.name}>{user.name || user.username}</h1>
            <span className={styles.badge}>Conta ativa</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Informações da conta</h2>

          <div className={styles.infoRow}>
            <span className={styles.label}>Nome</span>
            <span className={styles.value}>{user.name || "Não informado"}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Username</span>
            <span className={styles.value}>@{user.username}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setOpenEdit(true)}
          >
            Editar
          </button>

          <button
            className={`${styles.btn} ${styles.btnOutline}`}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Sair
          </button>

          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={() => setOpenDeleteModal(true)}
          >
            Excluir
          </button>
        </div>
      </div>

      <EditProfile isOpen={openEdit} onClose={() => setOpenEdit(false)} />

      <DeleteConfirmModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="sua conta"
      />
    </div>
  );
};

export default ProfilePage;
