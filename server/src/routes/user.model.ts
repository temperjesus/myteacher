const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutorName: { type: String, required: true },
    subject: { type: String, required: true },
    mode: { type: String, enum: ['Virtual', 'Presencial'], default: 'Virtual' },
    pricePerHour: { type: Number, required: true },
    hours: { type: Number, required: true },

    status: {
      type: String,
      enum: ['Disponible', 'Reservada', 'Pagada', 'Cerrada'],
      default: 'Disponible',
    },
    takenByStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    takenByStudentName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
