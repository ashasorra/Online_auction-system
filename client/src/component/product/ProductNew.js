import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // ✅ useHistory instead of useNavigate

export default function ProductNew() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const history = useHistory(); // ✅ v5 hook for navigation

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/category'); // adjust URL if needed
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files).slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Login required');

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('basePrice', formData.basePrice);
      fd.append('category', formData.category);
      images.forEach((file) => fd.append('image', file));

      await axios.post('/products', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      history.push('/myproduct'); // ✅ v5 navigation
    } catch (err) {
      console.error('Error adding product', err);
      alert('Failed to add product');
    }
  };

  return (
    <div className="container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Base Price</label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Images (max 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
