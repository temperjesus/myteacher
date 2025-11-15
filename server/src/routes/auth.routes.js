const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto';

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studyLevel, bio } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'El correo ya está registrado.' });

    const user = new User({ name, email, password, role, studyLevel, bio });
    await user.save();

    const token = createToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studyLevel: user.studyLevel,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el registro.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role });

    if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Usuario o contraseña incorrectos.' });

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studyLevel: user.studyLevel,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
});

module.exports = router;
