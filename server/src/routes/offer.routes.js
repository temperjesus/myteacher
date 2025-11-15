const express = require('express');
const Offer = require('../models/offer.model');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto';

// Middleware simple para leer usuario desde token
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Sin token' });

  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}

// GET /api/offers  (todas las ofertas disponibles para estudiantes)
router.get('/', async (_req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  res.json(offers);
});

// POST /api/offers  (crear oferta - solo tutor)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Solo tutores pueden crear ofertas.' });
  }

  const { subject, mode, pricePerHour, hours } = req.body;

  const offer = new Offer({
    tutorId: req.user.id,
    tutorName: req.user.name,
    subject,
    mode,
    pricePerHour,
    hours,
  });

  await offer.save();
  res.status(201).json(offer);
});

// POST /api/offers/:id/reserve  (reservar oferta como estudiante)
router.post('/:id/reserve', auth, async (req, res) => {
  if (req.user.role !== 'estudiante') {
    return res.status(403).json({ message: 'Solo estudiantes pueden reservar.' });
  }

  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Oferta no encontrada.' });
  if (offer.status !== 'Disponible') {
    return res.status(400).json({ message: 'La oferta ya no está disponible.' });
  }

  offer.status = 'Reservada';
  offer.takenByStudentId = req.user.id;
  offer.takenByStudentName = req.user.name;

  await offer.save();
  res.json(offer);
});

module.exports = router;
