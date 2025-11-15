export interface NotificationItem {
  id: string;
  userId: string;        // id del tutor o estudiante
  titulo: string;
  mensaje: string;
  fecha: string;         // ISO string
  leida: boolean;

  // aliases opcionales para que el HTML no dé error
  title?: string;
  body?: string;
  date?: string;
}

// alias por si en algún lado usas AppNotification
export type AppNotification = NotificationItem;
