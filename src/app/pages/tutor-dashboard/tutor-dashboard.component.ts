// src/app/pages/tutor-dashboard/tutor-dashboard.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Offer, OfferStatus } from '../../core/models/offer.model';
import { OfferService } from '../../core/services/offer.service';
import {
  NotificationItem,
  NotificationService,
} from '../../core/services/notification.service';

type FiltroEstado = 'Todos' | OfferStatus;

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.scss'],
})
export class TutorDashboardComponent implements OnInit, OnDestroy {
  tutorId = 'tutor-01'; // luego vendrá del usuario logueado
  tutorName = 'Dra. Elara Vance';

  // formulario de nueva oferta
  nueva: {
    subject: string;
    mode: 'Virtual' | 'Presencial';
    pricePerHour: number;
    hours: number;
  } = {
    subject: '',
    mode: 'Virtual',
    pricePerHour: 0,
    hours: 1,
  };

  filtro: FiltroEstado = 'Todos';

  ofertas: Offer[] = [];
  inbox: NotificationItem[] = [];

  private subOffers?: Subscription;
  private subInbox?: Subscription;

  constructor(
    private router: Router,
    private offersService: OfferService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.subOffers = this.offersService.offers$.subscribe((list) => {
      this.ofertas = list.filter((o) => o.tutorId === this.tutorId);
    });

    this.subInbox = this.notify.inboxFor(this.tutorId).subscribe((list) => {
      this.inbox = list;
    });
  }

  ngOnDestroy(): void {
    this.subOffers?.unsubscribe();
    this.subInbox?.unsubscribe();
  }

  // KPI: horas reservadas
  get totalHorasReservadas(): number {
    return this.ofertas
      .filter((o) => o.status === 'Reservada' || o.status === 'Pagada')
      .reduce((acc, o) => acc + o.hours, 0);
  }

  getClasesFiltradas(): Offer[] {
    if (this.filtro === 'Todos') return this.ofertas;
    return this.ofertas.filter((o) => o.status === this.filtro);
  }

  publicarOferta(): void {
    if (!this.nueva.subject.trim()) {
      alert('Escribe una materia para la oferta.');
      return;
    }
    if (this.nueva.pricePerHour <= 0) {
      alert('La tarifa debe ser mayor que 0.');
      return;
    }
    if (this.nueva.hours <= 0) {
      alert('Las horas deben ser mayores que 0.');
      return;
    }

    this.offersService.create({
      tutorId: this.tutorId,
      tutorName: this.tutorName,
      subject: this.nueva.subject.trim(),
      mode: this.nueva.mode,
      pricePerHour: this.nueva.pricePerHour,
      hours: this.nueva.hours,
      takenByStudentId: undefined,
      takenByStudentName: undefined,
    });

    // limpiar formulario
    this.nueva = {
      subject: '',
      mode: 'Virtual',
      pricePerHour: 0,
      hours: 1,
    };
  }

  iniciar(o: Offer): void {
    console.log('Iniciar tutoría para oferta', o);
    this.router.navigate(['/video-call']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
