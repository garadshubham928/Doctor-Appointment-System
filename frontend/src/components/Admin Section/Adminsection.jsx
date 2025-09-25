import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function Admin() {
  const [models, setModels] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    model_name: '',
    model_experience: '',
    model_hospital: '',
    rating: '',
    price: '',
    category: '',
    photo: ''
  });

  const categories = ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Oncology'];

  // Fetch models
  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/models');
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      } else {
        setMessage('Failed to fetch models');
      }
    } catch (error) {
      setMessage('Error fetching models: ' + error.message);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Convert image file to base64
  const convertImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split('base64,')[1]);
      reader.onerror = (error) => reject(error);
    });

  // Validate form
  const validateForm = () => {
    if (!formData.model_name.trim()) return setMessage('Doctor name is required');
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) return setMessage('Rating must be 1–5');
    if (!formData.price || formData.price <= 0) return setMessage('Price must be greater than 0');
    if (!formData.category.trim()) return setMessage('Category is required');
    if (!formData.model_experience.trim()) return setMessage('Experience is required');
    if (!formData.model_hospital.trim()) return setMessage('Hospital name is required');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      let submitData = { ...formData };
      if (image) {
        const base64Image = await convertImageToBase64(image);
        submitData.photo = base64Image;
      }

      const url = editingId
        ? `http://localhost:4000/api/models/${editingId}`
        : 'http://localhost:4000/api/models';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(editingId ? 'Doctor updated successfully!' : 'Doctor added successfully!');
        resetForm();
        fetchModels();
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Network error: ' + error.message);
    }

    setLoading(false);
  };

  const handleEdit = (model) => {
    setFormData({
      model_name: model.model_name,
      rating: model.rating,
      price: model.price,
      model_experience: model.model_experience,
      model_hospital: model.model_hospital,
      category: model.category,
      photo: model.photo || ''
    });
    setEditingId(model.id);
    setImage(null);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/models/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
          setMessage('Doctor deleted successfully!');
          fetchModels();
        } else {
          setMessage('Error: ' + (result.error || 'Failed to delete doctor'));
        }
      } catch (error) {
        setMessage('Error deleting doctor: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      model_name: '',
      rating: '',
      price: '',
      category: '',
      photo: '',
      model_experience: '',
      model_hospital: ''
    });
    setEditingId(null);
    setImage(null);
    setMessage('');
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 md:px-10">
        <div className="bg-gradient-to-r from-blue-500 to-purple-400 shadow rounded-lg p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center ">
              Admin Panel - Doctor Information
          </h1>
           <p>
              Add, edit, and manage doctor information
           </p>
        </div>
        <br/>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md text-sm ${
              message.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-blue-600 text-center md:text-left">
            {editingId ? 'Edit Doctor Information' : 'Add New Doctor'}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Doctor Name (Dr. Example)"
              value={formData.model_name}
              onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="number"
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="number"
              placeholder="Fees (₹)"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Experience (5 Years)"
              value={formData.model_experience}
              onChange={(e) => setFormData({ ...formData, model_experience: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="text"
              placeholder="Hospital Name (Example Hospital)"
              value={formData.model_hospital}
              onChange={(e) => setFormData({ ...formData, model_hospital: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="border rounded px-3 py-2 w-full sm:col-span-2 lg:col-span-3"
            />
            <div className="flex flex-col sm:flex-row gap-4 sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? editingId
                    ? 'Updating...'
                    : 'Adding...'
                  : editingId
                  ? 'Update Doctor'
                  : 'Add Doctor'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 p-4 md:p-6 border-b">
            All Doctors ({models.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Doctor Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Fees</th>
                  <th className="px-4 py-2">Experience</th>
                  <th className="px-4 py-2">Hospital Name</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{m.id}</td>
                    <td className="px-4 py-2">
                      {m.photo ? (
                        <img
                          src={`data:image/jpeg;base64,${m.photo}`}
                          alt={m.model_name}
                          className="h-12 w-12 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{m.model_name}</td>
                    <td className="px-4 py-2">{m.category}</td>
                    <td className="px-4 py-2">{m.rating} ⭐</td>
                    <td className="px-4 py-2">₹{parseFloat(m.price).toFixed(2)}</td>
                    <td className="px-4 py-2">{m.model_experience}</td>
                    <td className="px-4 py-2">{m.model_hospital}</td>
                    <td className="px-4 py-2 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

