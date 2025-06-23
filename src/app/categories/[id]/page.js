'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`/api/categories/${id}`)
      .then(res => setCategory(res.data))
      .catch(err => console.error(err));

    axios.get(`/api/movies?category=${id}`)
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!category) return <p style={{ color: 'white', padding: '1rem' }}>Chargement...</p>;

  return (
    <div style={{
      backgroundColor: '#121212',
      color: 'white',
      padding: '2rem',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        {category.image_url && (
          <img
            src={category.image_url}
            alt={category.name}
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 0 10px rgba(255,255,255,0.2)' }}
          />
        )}
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{category.name}</h1>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Films disponibles :</h2>

      {movies.length === 0 ? (
        <p>Aucun film dans cette catégorie.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1.2rem'
        }}>
          {movies.map(movie => (
            <div
              key={movie.id}
              style={{
                backgroundColor: '#222',
                borderRadius: '10px',
                padding: '0.8rem',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => window.location.href = `/movies/${movie.id}`}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '170px',
                  backgroundColor: '#444',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#aaa',
                  fontStyle: 'italic'
                }}>
                  Pas d'affiche
                </div>
              )}
              <h3 style={{ margin: '0', fontSize: '1rem', textAlign: 'center' }}>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
