import React, { useEffect, useState } from 'react';
import "../../styles/AdminViewBooks.css"; 
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';

function ViewBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, []);

  return (
    <>
      <Header />
      <div className="page-container">
        <main className="admin-books-container">
          <h1 className="admin-page-title">All Books</h1>
          <div className="table-wrapper">
            <table className="books-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Language</th>
                  <th>Price</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <tr key={book._id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={book.image || '/assets/default-book.png'}
                          alt={book.title}
                          className="book-thumbnail"
                        />
                      </td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.language}</td>
                      <td>${parseFloat(book.price).toFixed(2)}</td>
                      <td>{book.category}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No books found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ViewBooks;