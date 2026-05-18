import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import {
  notificationService,
  Notification,
} from "../../services/notificationService";
import styles from "./NotificationBell.module.css";

const POLL_INTERVAL = 30_000; // 30s

const timeAgo = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.bellBtn}
        onClick={handleOpen}
        aria-label="Notificações"
        title="Notificações"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Notificações</span>
            {unreadCount > 0 && (
              <button
                className={styles.markReadBtn}
                onClick={handleMarkAllRead}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <Bell size={28} opacity={0.25} />
                <span>Nenhuma notificação</span>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.item} ${!n.is_read ? styles.itemUnread : ""}`}
                >
                  {!n.is_read && <span className={styles.unreadDot} />}
                  <div className={styles.itemBody}>
                    <span className={styles.itemTitle}>{n.title}</span>
                    {n.message && (
                      <span className={styles.itemMessage}>{n.message}</span>
                    )}
                    <span className={styles.itemTime}>
                      {timeAgo(n.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
