import React, { useEffect, useState } from 'react';
import NavigationBar from './NavigationBar';
import BookCard from './BookCard';
import { Container, Row, Col, Button } from 'react-bootstrap';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editingId, setEditingId] = useState(null); // Track book being edited

  const API_URL = "http://localhost:5000/books";

  const fetchBooks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addOrUpdateBook = async () => {
    if (!title || !author) {
      alert("Please fill both title and author fields");
      return;
    }

    try {
      if (editingId) {
        // ✅ Update existing book
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author }),
        });

        if (!res.ok) throw new Error("Failed to update book");

        setEditingId(null);
      } else {
        // ✅ Add new book
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author }),
        });

        if (!res.ok) throw new Error("Failed to add book");
      }

      setTitle('');
      setAuthor('');
      fetchBooks();
    } catch (err) {
      console.error("Error adding/updating book:", err);
    }
  };

  const deleteBook = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book");
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const startEditing = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setEditingId(book._id);
  };

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <NavigationBar />

      <Container style={{ marginTop: '20px' }}>
        <Row>
          <Col md={6}>
            <h2>📚 Book Management App</h2>

            <div style={{ marginBottom: '20px' }}>
              <input
                placeholder="Book Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ marginRight: '10px', padding: '5px' }}
              />
              <input
                placeholder="Author"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                style={{ marginRight: '10px', padding: '5px' }}
              />
              <Button onClick={addOrUpdateBook} style={{ padding: '6px 12px' }}>
                {editingId ? "Update Book" : "Add Book"}
              </Button>
              {editingId && (
                <Button onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setAuthor('');
                }} style={{ padding: '6px 12px', marginLeft: '10px' }}>
                  Cancel
                </Button>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h3>Books List:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {books.length === 0 ? (
                <div>No books available</div>
              ) : (
                books.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    onEdit={startEditing}
                    onDelete={deleteBook}
                  />
                ))
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
