// src/components/Categories.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../app/css/categorie.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des catégories');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Catégories</h1>
      {error && <p>{error}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
