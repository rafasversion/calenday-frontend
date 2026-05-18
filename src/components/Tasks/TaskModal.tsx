import React, { useState, useEffect } from "react";
import styles from "../Modal/Modal.module.css";
import { taskService } from "../../services/taskService";
import { tagService } from "../../services/tagService";
import { X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit?: any;
}

const TaskModal = ({
  isOpen,
  onClose,
  onSuccess,
  taskToEdit,
}: TaskModalProps) => {
  const defaultFormData = {
    title: "",
    description: "",
    date_start: "",
    date_end: "",
    status: "todo" as "todo" | "doing" | "done",
    priority: "medium" as "low" | "medium" | "high",
    tag_ids: [] as number[],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [availableTags, setAvailableTags] = useState<
    { id: number; name: string }[]
  >([]);
  const [newTagName, setNewTagName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const formatForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const validateDates = () => {
    const startDate = new Date(formData.date_start);
    const endDate = new Date(formData.date_end);

    if (
      !formData.date_start ||
      !formData.date_end ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      setError("Datas inválidas.");
      return false;
    }

    if (endDate <= startDate) {
      setError("A data final deve ser posterior à data inicial.");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);

      tagService.getAll().then((data) => {
        if (data) setAvailableTags(data as any);
      });

      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title || "",
          description: taskToEdit.description || "",
          date_start: formatForInput(taskToEdit.date_start),
          date_end: formatForInput(taskToEdit.date_end),
          status: taskToEdit.status || "todo",
          priority: taskToEdit.priority || "medium",
          tag_ids: taskToEdit.tags ? taskToEdit.tags.map((t: any) => t.id) : [],
        });
      } else {
        setFormData(defaultFormData);
        setFiles([]);
      }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      if (files.length + selectedFiles.length > 5) {
        setError("Máximo de 5 arquivos permitido.");
        return;
      }

      setFiles([...files, ...selectedFiles]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    const newTag = await tagService.create(newTagName);

    if (newTag) {
      const tag = newTag as any;
      setAvailableTags([...availableTags, tag]);
      setFormData({ ...formData, tag_ids: [...formData.tag_ids, tag.id] });
      setNewTagName("");
    }
  };

  const toggleTag = (id: number) => {
    const isSelected = formData.tag_ids.includes(id);

    setFormData({
      ...formData,
      tag_ids: isSelected
        ? formData.tag_ids.filter((tagId) => tagId !== id)
        : [...formData.tag_ids, id],
    });
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!validateDates()) return;

    const toISO = (localStr: string) => {
      const date = new Date(localStr);
      return date.toISOString();
    };

    let result;

    if (taskToEdit) {
      result = await taskService.update(taskToEdit.id, {
        ...formData,
        date_start: toISO(formData.date_start),
        date_end: toISO(formData.date_end),
      });
    } else {
      result = await taskService.create({
        ...formData,
        date_start: toISO(formData.date_start),
        date_end: toISO(formData.date_end),
        files,
      });
    }

    if (result) {
      onSuccess();
      onClose();
      setFiles([]);
      setFormData(defaultFormData);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={`${styles.modalContainer} ${styles.modalSmall}`}>
        <button className={styles.modalClose} onClick={onClose}>
          <X size={20} />
        </button>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <h2 className={styles.modalSimpleTitle}>
            {taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>

          <div className={`${styles.modalSide} ${styles.modalSideContent}`}>
            <label className={styles.modalLabel}>
              Título
              <input
                type="text"
                className={styles.modalInput}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>

            <label className={styles.modalLabel}>
              Descrição
              <textarea
                className={styles.modalInput}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </label>

            <div className={styles.dateRow}>
              <label className={styles.modalLabel}>
                Início
                <input
                  type="datetime-local"
                  className={styles.modalInput}
                  value={formData.date_start}
                  onChange={(e) => {
                    setError(null);
                    setFormData({ ...formData, date_start: e.target.value });
                  }}
                  required
                />
              </label>

              <label className={styles.modalLabel}>
                Fim
                <input
                  type="datetime-local"
                  className={styles.modalInput}
                  value={formData.date_end}
                  onChange={(e) => {
                    setError(null);
                    setFormData({ ...formData, date_end: e.target.value });
                  }}
                  required
                />
              </label>
            </div>

            <div>
              <span className={styles.modalLabel}>Tags</span>

              <div className={styles.tagContainer}>
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    className={`${styles.tagItem} ${
                      formData.tag_ids.includes(tag.id)
                        ? styles.tagSelected
                        : ""
                    }`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              <div className={styles.addTagInputGroup}>
                <input
                  type="text"
                  placeholder="Nova tag..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className={styles.modalInput}
                />

                <button
                  type="button"
                  onClick={handleCreateTag}
                  className={styles.addTagBtn}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.modalSide} ${styles.modalSideContent}`}>
            <label className={styles.modalLabel}>
              Arquivos ({files.length}/5)
              <input
                type="file"
                multiple
                className={styles.fileInput}
                onChange={handleFileChange}
                disabled={files.length >= 5}
              />
              <ul className={styles.fileList}>
                {files.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <span>{file.name}</span>

                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={() => handleRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </label>

            <label className={styles.modalLabel}>
              Status
              <select
                className={styles.modalInput}
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "todo" | "doing" | "done",
                  })
                }
              >
                <option value="todo">Pendente</option>
                <option value="doing">Em Andamento</option>
                <option value="done">Concluída</option>
              </select>
            </label>

            <label className={styles.modalLabel}>
              Prioridade
              <select
                className={styles.modalInput}
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as "low" | "medium" | "high",
                  })
                }
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </label>

            {error && (
              <div className={styles.errorBox}>
                <span className={styles.errorIcon}>✕</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className={styles.modalButton}>
              {taskToEdit ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
