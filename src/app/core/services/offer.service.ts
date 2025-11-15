// src/app/core/services/offer.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  Offer,
  OfferStatus,
  CreateOfferDTO,
} from '../models/offer.model';

const STORAGE_KEY = 'myteacher_offers_v1';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private _offers$ = new BehaviorSubject<Offer[]>(this._load());
  public offers$ = this._offers$.asObservable();

  // ---------- helpers internos ----------

  private _load(): Offer[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Offer[]) : [];
    } catch {
      return [];
    }
  }

  private _save(list: Offer[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this._offers$.next(list);
  }

  private snapshot(): Offer[] {
    return this._offers$.getValue();
  }

  private updateStatus(id: string, status: OfferStatus): Offer | undefined {
    const list = this.snapshot().map((o) => {
      if (o._id === id || o.id === id) {
        return { ...o, status } as Offer;
      }
      return o;
    });

    this._save(list);
    return list.find((o) => o._id === id || o.id === id);
  }

  // ---------- API pública usada por los componentes ----------

  /** Carga todas las ofertas (student-dashboard) */
  loadAll(): Observable<Offer[]> {
    return this.offers$;
  }

  /** Crear oferta desde el dashboard del tutor */
  create(data: CreateOfferDTO): Offer {
    const now = new Date().toISOString();

    const offer: Offer = {
      _id: crypto.randomUUID(),
      tutorId: data.tutorId,
      tutorName: data.tutorName,
      subject: data.subject,
      mode: data.mode,
      pricePerHour: data.pricePerHour,
      hours: data.hours,
      status: 'Disponible',
      createdAt: now,
    };

    const list = [...this.snapshot(), offer];
    this._save(list);

    return offer;
  }

  /** Obtener una oferta por id (checkout) */
  getById(id: string): Offer | undefined {
    return this.snapshot().find((o) => o._id === id || o.id === id);
  }

  /** Reservar oferta desde el dashboard del estudiante */
  reserveOffer(
    id: string,
    studentId = 'student-001',
    studentName = 'Juan Pérez'
  ): Observable<Offer | undefined> {
    const list = this.snapshot().map((o) => {
      if (o._id === id || o.id === id) {
        const updated: Offer = {
          ...o,
          status: 'Reservada',
          takenByStudentId: studentId,
          takenByStudentName: studentName,
        };
        return updated;
      }
      return o;
    });

    this._save(list);
    const updated = list.find((o) => o._id === id || o.id === id);
    return of(updated);
  }

  /** Usado por checkout: marcar como pagada */
  markPaid(id: string): Observable<Offer | undefined> {
    const updated = this.updateStatus(id, 'Pagada');
    return of(updated);
  }

  /** Cerrar oferta (por ejemplo cuando ya pasó la clase) */
  close(id: string): Observable<Offer | undefined> {
    const updated = this.updateStatus(id, 'Cerrada');
    return of(updated);
  }
}
