// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationItem } from '../models/notification.model';

const STORAGE_KEY = 'myteacher_notifications_v1';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _inbox$ = new BehaviorSubject<NotificationItem[]>(this._load());
  public inbox$ = this._inbox$.asObservable();

  // ---------- helpers internos ----------

  private _load(): NotificationItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as NotificationItem[]) : [];
    } catch {
      return [];
    }
  }

  private _save(list: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this._inbox$.next(list);
  }

  private get list(): NotificationItem[] {
    return this._inbox$.getValue();
  }

  private set list(value: NotificationItem[]) {
    this._save(value);
  }

  // ---------- API pública ----------

  /**
   * Crea una notificación para un usuario
   */
  push(userId: string, titulo: string, mensaje: string): void {
    const noti: NotificationItem = {
      id: crypto.randomUUID(),
      userId,
      title: titulo,
      body: mensaje,
      date: new Date().toISOString(),
      leida: false,
    };

    this.list = [noti, ...this.list];
  }

  marcarLeida(id: string): void {
    this.list = this.list.map((n) =>
      n.id === id ? { ...n, leida: true } : n
    );
  }

  borrarParaUsuario(userId: string): void {
    this.list = this.list.filter((n) => n.userId !== userId);
  }
}
