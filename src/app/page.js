'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Movies from '../components/Movies';
import './home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      
  
      <section>
        <h2>Catégories :</h2>
        <ul className="categories">
          {categories.map(cat => (
            <li key={cat.id}>
              <Link href={`/categories/${cat.id}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Affichage des films */}
      <section>
        <Movies />
      </section>
    </div>
  );
}
