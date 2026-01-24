const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Order, sequelize } = require('./models/Order');

const app = express();
const PORT = 3002;
const SECRET_KEY = 'YOUR_SECRET_KEY'; // ten sam, co w Users

app.use(express.json());

// 🔹 Synchronizacja bazy
sequelize.sync().then(() => console.log('Baza Orders gotowa'));

// 🔹 Middleware autoryzacji JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Brak tokena' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Zły format tokena' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // id i email użytkownika
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token niepoprawny' });
  }
}

// GET /api/orders/:userId → lista zamówień użytkownika
app.get('/api/orders/:userId', async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.params.userId } });
  res.json(orders);
});

// POST /api/orders → dodanie zamówienia
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.id;

  if (!bookId || !quantity) return res.status(400).json({ message: 'bookId i quantity wymagane' });

  // 🔹 Sprawdzenie, czy książka istnieje w Books
  try {
    await axios.get(`http://localhost:3001/api/books/${bookId}`);
  } catch (err) {
    return res.status(400).json({ message: 'Książka nie istnieje' });
  }

  const order = await Order.create({ userId, bookId, quantity });
  res.status(201).json({ id: order.id });
});

// DELETE /api/orders/:orderId → usuń zamówienie
app.delete('/api/orders/:orderId', authMiddleware, async (req, res) => {
  const order = await Order.findByPk(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.userId !== req.user.id) return res.status(403).json({ message: 'Nie masz uprawnień' });

  await order.destroy();
  res.json({ message: 'Order deleted' });
});

// PATCH /api/orders/:orderId → aktualizacja ilości
app.patch('/api/orders/:orderId', authMiddleware, async (req, res) => {
  const { quantity } = req.body;
  if (!quantity) return res.status(400).json({ message: 'quantity wymagane' });

  const order = await Order.findByPk(req.params.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.userId !== req.user.id) return res.status(403).json({ message: 'Nie masz uprawnień' });

  order.quantity = quantity;
  await order.save();
  res.json({ message: 'Order updated' });
});

// Uruchomienie serwera
app.listen(PORT, () => console.log(`Orders service running on http://localhost:${PORT}`));
