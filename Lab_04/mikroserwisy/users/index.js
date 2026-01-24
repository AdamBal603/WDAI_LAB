const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, sequelize } = require('./models/User');

const app = express();
const PORT = 3003;
const SECRET_KEY = 'YOUR_SECRET_KEY'; // do JWT

app.use(express.json());

// 🔹 Synchronizacja bazy
sequelize.sync().then(() => {
  console.log('Baza Users gotowa');
});

// POST /api/register → rejestracja
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email i hasło wymagane' });

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Użytkownik już istnieje' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  res.status(201).json({ id: user.id });
});

// POST /api/login → logowanie
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email i hasło wymagane' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Niepoprawne hasło' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Users service running on http://localhost:${PORT}`);
});
