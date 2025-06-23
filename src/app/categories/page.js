'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Récupérer les catégories
  const fetchCategories = () => {
    axios.get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Erreur récupération :', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Ajouter une catégorie
  const handleAdd = () => {
    if (!newCategory.trim()) return;
    axios.post('/api/categories', { name: newCategory })
      .then(() => {
        setNewCategory('');
        fetchCategories();
      })
      .catch((err) => console.error('Erreur ajout :', err));
  };

  // Supprimer une catégorie
  const handleDelete = (id) => {
    axios.delete(`/api/categories/${id}`)
      .then(() => fetchCategories())
      .catch((err) => console.error('Erreur suppression :', err));
  };

  // Début modification
  const startEdit = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  // Annuler modification
  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  // Sauvegarder modification
  const handleUpdate = () => {
    axios.put(`/api/categories/${editingCategoryId}`, { name: editingCategoryName })
      .then(() => {
        cancelEdit();
        fetchCategories();
      })
      .catch((err) => console.error('Erreur mise à jour :', err));
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
  <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Catégories</h1>

  {/* Création */}
  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
    <input
      type="text"
      placeholder="Nouvelle catégorie"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      style={{
        padding: '0.5rem',
        fontSize: '1rem',
        width: '60%',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}
    />
    <button
      onClick={handleAdd}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Ajouter
    </button>
  </div>

  {/* Liste */}
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {categories.map((category) => (
      <li
        key={category.id}
        style={{
          backgroundColor: '#f8f8f8',
          margin: '0.5rem 0',
          padding: '0.75rem 1rem',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {editingCategoryId === category.id ? (
          <>
            <input
              type="text"
              value={editingCategoryName}
              onChange={(e) => setEditingCategoryName(e.target.value)}
              style={{ flex: 1, marginRight: '1rem', padding: '0.5rem' }}
            />
            <button
              onClick={handleUpdate}
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Sauvegarder
            </button>
            <button
              onClick={cancelEdit}
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem 0.75rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <span style={{ color: 'black' }}>{category.name}</span>
            <div>
              <button
                onClick={() => startEdit(category)}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#ffc107',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Supprimer
              </button>
            </div>
          </>
        )}
      </li>
    ))}
  </ul>
</div>

  );
}
