// src/app/pages/student-dashboard/student-dashboard.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Offer } from '../../core/models/offer.model';
import { OfferService } from '../../core/services/offer.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnDestroy {
  ofertas: Offer[] = [];
  inboxSub?: Subscription;
  studentId = 'student-001';

  constructor(
    public offers: OfferService,
    private notify: NotificationService
  ) {
    this.offers.loadAll().subscribe((list) => (this.ofertas = list));
  }

  reservar(offer: Offer): void {
    const id = offer._id || offer.id!;
    this.offers.reserveOffer(id, this.studentId, 'Juan Pérez').subscribe({
      next: (o) => {
        if (o) {
          this.notify.push(
            o.tutorId,
            'Nueva reserva',
            `El estudiante Juan Pérez reservó tu oferta de ${o.subject}.`
          );
          alert('Reserva realizada correctamente');
        }
      },
      error: (err) =>
        alert(err?.error?.message || 'Error al reservar la oferta'),
    });
  }

  ngOnDestroy(): void {
    this.inboxSub?.unsubscribe();
  }
}
