const express = require('express');
const bodyParser = require('body-parser');
const { Book, sequelize } = require('./models/Book');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// 🔹 Synchronizacja bazy
sequelize.sync().then(() => {
  console.log('Baza Books gotowa');
});

// GET /api/books → lista wszystkich książek
app.get('/api/books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

// GET /api/books/:bookId → szczegóły książki
app.get('/api/books/:bookId', async (req, res) => {
  const book = await Book.findByPk(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// POST /api/books → dodanie książki
app.post('/api/books', async (req, res) => {
  const { title, author, year } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const newBook = await Book.create({ title, author, year });
  res.status(201).json({ id: newBook.id });
});

// DELETE /api/books/:bookId → usunięcie książki
app.delete('/api/books/:bookId', async (req, res) => {
  const book = await Book.findByPk(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  await book.destroy();
  res.json({ message: 'Book deleted' });
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Books service running on http://localhost:${PORT}`);
});
