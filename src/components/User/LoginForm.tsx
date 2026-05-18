import React, { useContext, useState, useEffect } from "react";
import styles from "../Modal/Modal.module.css";
import { userService } from "../../services/userService";
import { googleLoginService } from "../../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAction } = useContext(UserContext);

  const state = location.state as { email?: string; password?: string } | null;

  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassword] = useState(state?.password || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent;

    const isWebView =
      /wv|WebView/i.test(ua) ||
      (ua.includes("Android") && !ua.includes("Chrome")) ||
      (ua.includes("iPhone") && !ua.includes("Safari"));

    if (isWebView) {
      setGoogleAvailable(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Digite um email válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await userService.login({
        email,
        password,
      });

      if (result?.token) {
        await loginAction(result.token);
        navigate("/dashboard");
      } else {
        setError("Email ou senha inválidos.");
      }
    } catch (err: any) {
      console.error(err);

      if (err?.message?.includes("Failed to fetch")) {
        setError("Erro ao conectar com o servidor.");
      } else {
        setError("Erro ao fazer login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setError("");
    setIsLoading(true);

    try {
      if (!credentialResponse.credential) {
        setError("Falha ao autenticar com Google.");
        return;
      }

      const payload = JSON.parse(
        atob(credentialResponse.credential.split(".")[1]),
      );

      const result = await googleLoginService(
        credentialResponse.credential,
        payload.email,
        payload.email.split("@")[0],
        payload.picture,
      );

      if (result?.token) {
        await loginAction(result.token);
        navigate("/dashboard");
      } else {
        setError("Erro ao entrar com Google.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.modalForm} onSubmit={handleSubmit}>
      <label className={styles.modalLabel}>
        Email
        <input
          type="email"
          className={styles.modalInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </label>

      <label className={styles.modalLabel}>
        Senha
        <input
          type="password"
          className={styles.modalInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </label>

      {error && <span className={styles.modalError}>{error}</span>}

      <button type="submit" className={styles.modalButton} disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </button>

      <div className={styles.authDivider}>
        <span>ou</span>
      </div>

      <div className={styles.googleWrapper}>
        {googleAvailable ? (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Falha ao entrar com Google.")}
            theme="outline"
            shape="rectangular"
            width="320"
          />
        ) : (
          <button type="button" className={styles.googleButton} disabled>
            Google indisponível neste navegador
          </button>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
