'use client';
import axios from 'axios';
import Link from 'next/link'; // Import du composant de navigation Next.js
import { useEffect, useState } from 'react';

export default function MoviesPage() {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = axios.get('/api/categories');
    const fetchMovies = axios.get('/api/movies');

    Promise.all([fetchCategories, fetchMovies])
      .then(([catRes, movieRes]) => {
        setCategories(catRes.data);
        setMovies(movieRes.data);
      })
      .catch(() => setError('Erreur lors du chargement des données'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!categories.length || !movies.length) return <p>Chargement...</p>;

  const groupedByCategory = categories.map(category => ({
    category,
    movies: movies.filter(movie =>
      movie.categories?.some(cat => parseInt(cat.id) === parseInt(category.id))
    ),
  }));

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px' }}>Films/Séries par catégorie</h1>

      {groupedByCategory.map(({ category, movies }) => (
        <div key={category.id} style={{ marginBottom: '40px' }}>
          <h2
            style={{
              color: '#fff',
              marginBottom: '15px',
              borderBottom: '3px solid #e50914',
              display: 'inline-block',
              paddingBottom: '5px',
              fontSize: '24px'
            }}
          >
            {category.name}
          </h2>

          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
            {movies.length > 0 ? (
              movies.map(movie => (
                <Link key={movie.id} href={`/movies/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ minWidth: '150px', cursor: 'pointer' }}>
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      style={{
                        width: '150px',
                        height: '225px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        transition: 'transform 0.3s',
                      }}
                      onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <h4 style={{ marginTop: '8px', fontSize: '16px', color: '#ddd' }}>{movie.title}</h4>
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>Aucun film dans cette catégorie.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
