'use client';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: '',
    rating: '',
    poster_url: '',
    trailer_url: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/movies/${id}`)
      .then(res => {
        setMovie(res.data);
        setFormData(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('Film introuvable');
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/movies/${id}`, formData);
      setIsEditing(false);
      setMovie(formData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce film ?")) return;
    try {
      await axios.delete(`/api/movies/${id}`);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  if (error) return <p style={{ color: 'red', padding: '1rem' }}>{error}</p>;
  if (!movie) return <p style={{ color: 'white', padding: '1rem' }}>Chargement...</p>;

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto',
      color: 'white',
      backgroundColor: '#121212',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{ marginBottom: '1.5rem', borderBottom: '2px solid white', paddingBottom: '0.5rem' }}>
        Détails du film
      </h1>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleUpdate();
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre"
            style={inputStyle}
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            required
          />
          <input
            name="release_year"
            value={formData.release_year}
            onChange={handleChange}
            placeholder="Année"
            type="number"
            min="1800"
            max="2100"
            style={inputStyle}
            required
          />
          <input
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Note"
            type="number"
            min="0"
            max="10"
            step="0.1"
            style={inputStyle}
          />
          <input
            name="poster_url"
            value={formData.poster_url}
            onChange={handleChange}
            placeholder="URL Poster"
            type="url"
            style={inputStyle}
          />
          <input
            name="trailer_url"
            value={formData.trailer_url}
            onChange={handleChange}
            placeholder="URL Trailer"
            type="url"
            style={inputStyle}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" style={buttonSaveStyle}>💾 Sauvegarder</button>
            <button type="button" onClick={() => setIsEditing(false)} style={buttonCancelStyle}>❌ Annuler</button>
          </div>
        </form>
      ) : (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>{movie.title}</h2>
          <img
            src={movie.poster_url}
            alt={movie.title}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          />
          <p><strong>Description :</strong> {movie.description}</p>
          <p><strong>Année :</strong> {movie.release_year}</p>
          <p><strong>Note :</strong> {movie.rating}</p>
          <a
            href={movie.trailer_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1e90ff', textDecoration: 'underline' }}
          >
            🎬 Bande-annonce
          </a>

          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setIsEditing(true)} style={buttonEditStyle}>✏️ Modifier</button>
            <button onClick={handleDelete} style={buttonDeleteStyle}>🗑️ Supprimer</button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #444',
  backgroundColor: '#222',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.3s',
};

const buttonBase = {
  padding: '10px 15px',
  borderRadius: '5px',
  border: 'none',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const buttonSaveStyle = {
  ...buttonBase,
  backgroundColor: '#28a745',
  color: 'white',
};

const buttonCancelStyle = {
  ...buttonBase,
  backgroundColor: '#6c757d',
  color: 'white',
};

const buttonEditStyle = {
  ...buttonBase,
  backgroundColor: '#007bff',
  color: 'white',
  marginRight: '1rem',
};

const buttonDeleteStyle = {
  ...buttonBase,
  backgroundColor: '#dc3545',
  color: 'white',
};
