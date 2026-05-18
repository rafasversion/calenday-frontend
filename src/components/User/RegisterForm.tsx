import React, { useState } from "react";
import styles from "../Modal/Modal.module.css";
import { userService } from "../../services/userService";

interface RegisterFormProps {
  onSuccess: (data: { email: string; password: string }) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const validate = () => {
    if (data.name.trim().length < 3) {
      return "Nome precisa ter pelo menos 3 caracteres";
    }

    if (!data.email.includes("@") || !data.email.includes(".")) {
      return "Email inválido";
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (data.password.length < 6 || !passwordRegex.test(data.password)) {
      return "Senha precisa ter no mínimo 6 caracteres, 1 número e 1 caractere especial";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const result: any = await userService.register(data);

    if (!result) {
      setError("Erro ao cadastrar");
      return;
    }

    if (result.error?.includes("email")) {
      setError("Já existe uma conta com esse email");
      return;
    }

    onSuccess({ email: data.email, password: data.password });
  };

  return (
    <form className={styles.modalForm} onSubmit={handleSubmit}>
      <label className={styles.modalLabel}>
        Nome completo
        <input
          type="text"
          className={styles.modalInput}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
      </label>

      <label className={styles.modalLabel}>
        Email
        <input
          type="email"
          className={styles.modalInput}
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
      </label>

      <label className={styles.modalLabel}>
        Senha
        <input
          type="password"
          className={styles.modalInput}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />
      </label>

      {error && <span className={styles.modalError}>{error}</span>}

      <button type="submit" className={styles.modalButton}>
        Cadastrar
      </button>
    </form>
  );
};

export default RegisterForm;
