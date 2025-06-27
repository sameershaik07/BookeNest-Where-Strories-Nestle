import React, { useState } from "react";
import axios from "axios";
import "../../styles/AdminAddBook.css"; 
import Header from '../../pages/Header';
import Footer from '../../pages/Footer';


export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    language: "",
    price: "",
    image: "",
    description: "",
    googleDriveLink: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Button disables now
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsError(true);
        setMessage("You must be logged in as admin to add books.");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/books/add", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsError(false);
      setMessage("✅ Book added successfully!");
      setForm({
        title: "",
        author: "",
        category: "",
        language: "",
        price: "",
        image: "",
        description: "",
        googleDriveLink: ""
      });
    } catch (err) {
      console.error("Add book failed:", err);
      if (err.response && err.response.status === 401) {
        setMessage("Unauthorized access. Please login again.");
      } else {
        setMessage("❌ Failed to add book: " + (err.response?.data?.error || err.message));
      }
      setIsError(true);
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <>
          <Header />

    <div className="add-book-page">
      <form className="add-book-form" onSubmit={handleSubmit}>
        <h2 className="form-title">📚 Add New Book</h2>
        {message && (
          <p className={`form-message ${isError ? "error" : "success"}`}>{message}</p>
        )}
        <input name="title" placeholder="Title*" value={form.title} onChange={handleChange} required />
        <input name="author" placeholder="Author*" value={form.author} onChange={handleChange} required />
        <input name="category" placeholder="Category*" value={form.category} onChange={handleChange} required />
        <input name="language" placeholder="Language" value={form.language} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price*" value={form.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} rows={3} onChange={handleChange} />
        <input name="googleDriveLink" placeholder="Google Drive Link*" value={form.googleDriveLink} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
          <Footer />
    </>

  );
}
