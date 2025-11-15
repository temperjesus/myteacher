// src/app/pages/checkout/checkout.component.ts

import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Offer } from '../../core/models/offer.model';
import { OfferService } from '../../core/services/offer.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  offer?: Offer;
  studentId = 'student-001';        // luego vendrá del auth
  studentName = 'Juan Pérez';       // idem

  card = { name: '', number: '', exp: '', cvv: '' };

  subtotal = computed(() => (this.offer ? this.offer.pricePerHour * this.offer.hours : 0));
  fee = computed(() => +(this.subtotal() * 0.02).toFixed(0)); // 2% comisión
  total = computed(() => this.subtotal() + this.fee());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offers: OfferService,
    private notify: NotificationService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.offer = this.offers.getById(id);
    }

    if (!this.offer) {
      alert('Oferta no encontrada');
      this.router.navigate(['/student/dashboard']);
    }
  }

  pay(): void {
    if (!this.offer) return;

    // validación simple de tarjeta
    if (!this.card.name || !this.card.number || !this.card.exp || !this.card.cvv) {
      alert('Completa los datos de la tarjeta.');
      return;
    }

    const updated = this.offers.markPaid(this.offer.id);
    if (!updated) {
      alert('No se pudo actualizar la oferta.');
      return;
    }

    // notificación al tutor
    this.notify.push(
      updated.tutorId,
      'Pago confirmado',
      `${this.studentName} pagó tu clase de ${updated.subject}.`
    );

    alert('Pago realizado con éxito');
    this.router.navigate(['/student/dashboard']);
  }
}
