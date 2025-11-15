// src/app/core/models/offer.model.ts

export type OfferMode = 'Virtual' | 'Presencial';
export type OfferStatus = 'Disponible' | 'Reservada' | 'Pagada' | 'Cerrada';

export interface Offer {
  // Cuando venga del backend puede venir como _id
  _id?: string;
  // Para datos creados sólo en front (localStorage) usamos id
  id?: string;

  tutorId: string;
  tutorName: string;

  subject: string;
  mode: OfferMode;
  pricePerHour: number;
  hours: number;

  status: OfferStatus;

  takenByStudentId?: string;
  takenByStudentName?: string;

  createdAt: string;
}

export interface CreateOfferDTO {
  tutorId: string;
  tutorName: string;
  subject: string;
  mode: OfferMode;
  pricePerHour: number;
  hours: number;
}
