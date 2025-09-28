// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const port = 5000;

// ✅ CORS configuration to allow requests from frontend (port 3001)
const corsOptions = {
  origin: "http://localhost:3000", // your frontend port
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

// Book model
const Book = require("./models/book");

// Routes
app.get("/", (req, res) => {
  res.send("📚 Welcome to Book Management App!");
});

// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error });
  }
});

// Add a new book
app.post("/books", async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  try {
    const newBook = new Book({ title, author });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error saving book", error });
  }
});

// Update a book
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, { title, author }, { new: true });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

