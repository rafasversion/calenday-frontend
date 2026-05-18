import React, { useState, useEffect } from "react";
import styles from "../Modal/Modal.module.css";
import eventStyles from "./EventModal.module.css";
import { eventService } from "../../services/eventService";
import { X } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: any;
}

const PRESET_COLORS = [
  { value: "#cc7b76", label: "Terracota" },
  { value: "#d4a43a", label: "Âmbar" },
  { value: "#8a9b65", label: "Sálvia" },
  { value: "#7a9db5", label: "Azul cinza" },
  { value: "#9b89b4", label: "Lavanda" },
  { value: "#c98a8a", label: "Rosa antigo" },
  { value: "#6aaa96", label: "Teal suave" },
  { value: "#a07850", label: "Marrom" },
];

const NOTIFY_OPTIONS = [
  { label: "Na hora", minutes: 0 },
  { label: "5 minutos antes", minutes: 5 },
  { label: "10 minutos antes", minutes: 10 },
  { label: "15 minutos antes", minutes: 15 },
  { label: "30 minutos antes", minutes: 30 },
  { label: "1 hora antes", minutes: 60 },
  { label: "2 horas antes", minutes: 120 },
  { label: "1 dia antes", minutes: 1440 },
  { label: "Sem notificação", minutes: -1 },
];

const splitDateTime = (iso: string): { date: string; time: string } => {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  const [datePart, timePart] = local.toISOString().split("T");
  return { date: datePart, time: timePart.slice(0, 5) };
};

const joinDateTime = (date: string, time: string): string => {
  if (!date || !time) return "";
  const local = new Date(`${date}T${time}:00`);
  return local.toISOString();
};

const subtractMinutes = (time: string, minutes: number): string | null => {
  if (!time || minutes < 0) return null;
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m - minutes;
  if (total < 0) return null;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const calcMinutesBefore = (notifyIso: string, startIso: string): number => {
  if (!notifyIso || !startIso) return 30;
  const diff =
    (new Date(startIso).getTime() - new Date(notifyIso).getTime()) / 60000;
  const match = NOTIFY_OPTIONS.find((o) => o.minutes === Math.round(diff));
  return match ? match.minutes : 30;
};

const EventModal = ({
  isOpen,
  onClose,
  onSuccess,
  eventToEdit,
}: AddEventModalProps) => {
  const defaultData = {
    title: "",
    description: "",
    date: "",
    time_start: "",
    time_end: "",
    location: "",
    color: PRESET_COLORS[2].value,
    recurrence: "none" as "none" | "daily" | "weekdays" | "monthly",
  };

  const [formData, setFormData] = useState(defaultData);
  const [notifyMinutes, setNotifyMinutes] = useState(30);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (eventToEdit) {
        const start = splitDateTime(eventToEdit.date_start);
        const end = splitDateTime(
          eventToEdit.date_end || eventToEdit.date_start,
        );
        setFormData({
          title: eventToEdit.title || "",
          description: eventToEdit.description || "",
          date: start.date,
          time_start: start.time,
          time_end: end.time,
          location: eventToEdit.location || "",
          color: eventToEdit.color || PRESET_COLORS[2].value,
          recurrence: eventToEdit.recurrence || "none",
        });
        setNotifyMinutes(
          eventToEdit.notify_at
            ? calcMinutesBefore(eventToEdit.notify_at, eventToEdit.date_start)
            : 30,
        );
      } else {
        setFormData(defaultData);
        setNotifyMinutes(30);
        setFiles([]);
      }
    }
  }, [isOpen, eventToEdit]);

  if (!isOpen) return null;

  const set = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 5) {
      setError("Máximo de 5 arquivos.");
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
  };

  const notifyTimeLabel = (() => {
    if (notifyMinutes === -1 || !formData.time_start) return null;
    const t = subtractMinutes(formData.time_start, notifyMinutes);
    return t ? `às ${t}` : "(ajuste o horário de início)";
  })();

  const validateForm = () => {
    if (!formData.date || !formData.time_start) {
      setError("Preencha data e horário de início.");
      return false;
    }

    if (formData.time_end) {
      const start = new Date(`${formData.date}T${formData.time_start}`);
      const end = new Date(`${formData.date}T${formData.time_end}`);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError("Horários inválidos.");
        return false;
      }

      if (end <= start) {
        setError("O horário final deve ser após o inicial.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const date_start = joinDateTime(formData.date, formData.time_start);
      const date_end = formData.time_end
        ? joinDateTime(formData.date, formData.time_end)
        : undefined;

      const notifyTime =
        notifyMinutes >= 0 && formData.time_start
          ? subtractMinutes(formData.time_start, notifyMinutes)
          : null;

      const notify_at = notifyTime
        ? joinDateTime(formData.date, notifyTime)
        : undefined;

      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        date_start,
        date_end,
        location: formData.location || undefined,
        color: formData.color,
        recurrence: formData.recurrence,
        notify_at,
      };

      const result: any = eventToEdit
        ? await eventService.update(eventToEdit.id, payload)
        : await eventService.create({ ...payload, files });

      if (result?.id) {
        onSuccess();
        onClose();
        setFiles([]);
        setFormData(defaultData);
        setNotifyMinutes(30);
      } else {
        setError(result?.error || result?.message || "Erro ao salvar evento.");
      }
    } catch (err: any) {
      setError(err?.message || "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={`${styles.modalContainer} ${styles.modalSmall}`}>
        <button className={styles.modalClose} onClick={onClose} type="button">
          <X size={20} />
        </button>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <h2 className={styles.modalSimpleTitle}>
            {eventToEdit ? "Editar Evento" : "Novo Evento"}
          </h2>

          <div className={`${styles.modalSide} ${styles.modalSideContent}`}>
            <label className={styles.modalLabel}>
              Título
              <input
                type="text"
                className={styles.modalInput}
                value={formData.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Nome do evento"
                required
              />
            </label>

            <label className={styles.modalLabel}>
              Descrição
              <textarea
                className={styles.modalInput}
                value={formData.description}
                rows={3}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Descreva o evento..."
              />
            </label>

            <label className={styles.modalLabel}>
              Data
              <input
                type="date"
                className={styles.modalInput}
                value={formData.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </label>

            <div className={styles.dateRow}>
              <label className={styles.modalLabel}>
                Início
                <input
                  type="time"
                  className={styles.modalInput}
                  value={formData.time_start}
                  onChange={(e) => set("time_start", e.target.value)}
                  required
                />
              </label>
              <label className={styles.modalLabel}>
                Fim
                <input
                  type="time"
                  className={styles.modalInput}
                  value={formData.time_end}
                  onChange={(e) => set("time_end", e.target.value)}
                />
              </label>
            </div>

            <label className={styles.modalLabel}>
              Local
              <input
                type="text"
                className={styles.modalInput}
                value={formData.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Onde será o evento?"
              />
            </label>

            <div>
              <span className={styles.modalLabel}>Cor do evento</span>
              <div className={eventStyles.colorPicker}>
                {PRESET_COLORS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${eventStyles.colorSwatch} ${formData.color === value ? eventStyles.colorSwatchActive : ""}`}
                    style={{ background: value }}
                    onClick={() => set("color", value)}
                    title={label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles.modalSide} ${styles.modalSideContent}`}>
            <label className={styles.modalLabel}>
              Recorrência
              <select
                className={styles.modalInput}
                value={formData.recurrence}
                onChange={(e) => set("recurrence", e.target.value as any)}
              >
                <option value="none">Sem recorrência</option>
                <option value="daily">Diária</option>
                <option value="weekdays">Dias úteis</option>
                <option value="monthly">Mensal</option>
              </select>
            </label>

            <div>
              <span className={styles.modalLabel}>Notificação</span>
              <div className={eventStyles.notifyRow}>
                <select
                  className={`${styles.modalInput} ${eventStyles.notifySelect}`}
                  value={notifyMinutes}
                  onChange={(e) => setNotifyMinutes(Number(e.target.value))}
                >
                  {NOTIFY_OPTIONS.map((o) => (
                    <option key={o.minutes} value={o.minutes}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {notifyTimeLabel && (
                  <span className={eventStyles.notifyTime}>
                    {notifyTimeLabel}
                  </span>
                )}
              </div>
            </div>

            <label className={styles.modalLabel}>
              Arquivos ({files.length}/5)
              <input
                type="file"
                multiple
                className={styles.fileInput}
                onChange={handleFileChange}
                disabled={files.length >= 5}
              />
              {files.length > 0 && (
                <ul className={styles.fileList}>
                  {files.map((file, i) => (
                    <li key={i} className={styles.fileItem}>
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className={styles.removeFileBtn}
                        onClick={() =>
                          setFiles((p) => p.filter((_, idx) => idx !== i))
                        }
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </label>

            {formData.title && (
              <div
                className={eventStyles.eventPreview}
                style={{ background: formData.color }}
              >
                <span className={eventStyles.eventPreviewTitle}>
                  {formData.title}
                </span>
                {formData.date && (
                  <span className={eventStyles.eventPreviewLocation}>
                    📅{" "}
                    {new Date(formData.date + "T00:00").toLocaleDateString(
                      "pt-BR",
                      { weekday: "short", day: "2-digit", month: "short" },
                    )}
                    {formData.time_start && ` · ${formData.time_start}`}
                    {formData.time_end && ` – ${formData.time_end}`}
                  </span>
                )}
                {formData.location && (
                  <span className={eventStyles.eventPreviewLocation}>
                    📍 {formData.location}
                  </span>
                )}
              </div>
            )}

            {error && (
              <div className={eventStyles.errorBox}>
                <span className={eventStyles.errorIcon}>✕</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={styles.modalButton}
              disabled={loading}
            >
              {loading
                ? "Enviando..."
                : eventToEdit
                  ? "Salvar Alterações"
                  : "Criar Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
