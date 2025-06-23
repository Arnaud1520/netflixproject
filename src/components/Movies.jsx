'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../app/css/movie.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/api/movies');
        setMovies(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des films');
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="movies-container">
      <h1 style={{ color: '#fff' }}>Films et Séries</h1>
      {error && <p className="error">{error}</p>}
      <ul className="movies-list">
        {movies.map((movie) => (
          <li key={movie.id} className="movie-card">
            <Link href={`/movies/${movie.id}`}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
                <p>Année de sortie: {movie.release_year}</p>
                <p>Note: {movie.rating}</p>
              </div>
            </Link>
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-link"
            >
              Voir la bande-annonce
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
