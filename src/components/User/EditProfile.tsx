import { useState, useEffect } from "react";
import styles from "./EditProfile.module.css";
import { userService } from "../../services/userService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile = ({ isOpen, onClose }: Props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const user = await userService.getProfile();
        if (user && !user.error) {
          setData({
            name: user.name || "",
            email: user.email || "",
            password: "",
          });
        }
      } catch (err) {
        setError("Erro ao carregar perfil");
      }
    };

    load();
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    if (data.name.trim().length < 3) return "Nome inválido";
    if (!data.email.includes("@")) return "Email inválido";

    if (data.password) {
      const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (data.password.length < 6 || !regex.test(data.password)) {
        return "Senha inválida";
      }
    }

    return null;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      const res = (await userService.updateProfile({
        name: data.name,
        email: data.email,
        password: data.password || undefined,
      })) as { error?: string };

      if (res && res.error) {
        setError(res.error);
        return;
      }

      onClose();
      window.location.reload();
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar o perfil");
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />

      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Editar perfil</h2>

        {error && <span className={styles.error}>{error}</span>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Nome"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <input
            className={styles.input}
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Nova senha"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <button className={styles.button}>Salvar</button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
