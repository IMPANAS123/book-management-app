import React from 'react';
import { Card, Button } from 'react-bootstrap';

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>{book.author}</Card.Text>
        <Button variant="primary" onClick={() => onEdit(book)}>Edit</Button>
        <Button variant="danger" onClick={() => onDelete(book._id)} style={{ marginLeft: '10px' }}>Delete</Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
