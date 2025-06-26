'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MoviesPage() {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    release_year: '',
    rating: '',
    poster_url: '',
    trailer_url: '',
    category_id: '',
  });

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

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/movies', {
        ...newMovie,
        release_year: parseInt(newMovie.release_year),
        rating: parseFloat(newMovie.rating),
        category_id: parseInt(newMovie.category_id),
      });

      const movieId = response.data.movieId;
      const newMovieObject = {
        ...newMovie,
        id: movieId,
        categories: [{ id: newMovie.category_id }],
      };

      setMovies(prev => [...prev, newMovieObject]);
      setNewMovie({
        title: '',
        description: '',
        release_year: '',
        rating: '',
        poster_url: '',
        trailer_url: '',
        category_id: '',
      });
      setShowForm(false);
    } catch (err) {
      console.error('Erreur lors de la création du film', err);
    }
  };

  const groupedByCategory = categories.map(category => ({
    category,
    movies: movies.filter(movie =>
      movie.categories?.some(cat => parseInt(cat.id) === parseInt(category.id))
    ),
  }));

  return (
    <div style={{ padding: '20px', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px' }}>Films/Séries par catégorie</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: '20px',
          padding: '12px 24px',
          backgroundColor: '#e50914',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background 0.3s ease'
        }}
      >
        {showForm ? 'Annuler' : 'Ajouter un film'}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreateMovie}
          style={{
            backgroundColor: '#1c1c1c',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '40px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '450px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)'
          }}
        >
          {[
            { type: 'text', placeholder: 'Titre du film', key: 'title' },
            { type: 'textarea', placeholder: 'Description', key: 'description' },
            { type: 'number', placeholder: 'Année de sortie', key: 'release_year' },
            { type: 'number', step: '0.1', placeholder: 'Note (ex: 7.5)', key: 'rating' },
            { type: 'text', placeholder: "URL de l'affiche", key: 'poster_url' },
            { type: 'text', placeholder: 'URL de la bande-annonce', key: 'trailer_url' },
          ].map(field =>
            field.type === 'textarea' ? (
              <textarea
                key={field.key}
                placeholder={field.placeholder}
                value={newMovie[field.key]}
                onChange={e => setNewMovie({ ...newMovie, [field.key]: e.target.value })}
                required
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '10px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            ) : (
              <input
                key={field.key}
                type={field.type}
                step={field.step}
                placeholder={field.placeholder}
                value={newMovie[field.key]}
                onChange={e => setNewMovie({ ...newMovie, [field.key]: e.target.value })}
                required
                style={{
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '10px',
                  fontSize: '14px'
                }}
              />
            )
          )}

          <select
            value={newMovie.category_id}
            onChange={e => setNewMovie({ ...newMovie, category_id: e.target.value })}
            required
            style={{
              backgroundColor: '#2a2a2a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '5px',
              padding: '10px',
              fontSize: '14px'
            }}
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: '#e50914',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          >
            Ajouter
          </button>
        </form>
      )}

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
