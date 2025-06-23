'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Recherche pour:', searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      backgroundColor: '#121212', 
      color: 'white' 
    }}>
      {/* Logo Netflix à gauche */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            style={{ height: '40px', cursor: 'pointer' }}
          />
        </Link>
      </div>

      {/* Menu + recherche + boutons à droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <ul style={{ 
          listStyle: 'none', 
          display: 'flex', 
          gap: '1.5rem', 
          margin: 0, 
          padding: 0,
          alignItems: 'center',
        }}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href="/movies">Séries</Link></li>
          <li><Link href="/movies">Films</Link></li>
          <li><Link href="/favorites">Favoris</Link></li>
          <li><Link href="/categories">Catégories</Link></li> {/* ← ajouté ici */}
        </ul>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            outline: 'none',
            minWidth: '200px',
          }}
        />
        <button 
          onClick={handleSearch}
          style={{
            backgroundColor: '#e50914',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Rechercher
        </button>

        <Link href="/login">
          <button style={{
            backgroundColor: 'transparent',
            border: '1px solid #e50914',
            color: '#e50914',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>
            Se connecter
          </button>
        </Link>

        <Link href="/register">
          <button style={{
            backgroundColor: '#e50914',
            border: 'none',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>
            S'inscrire
          </button>
        </Link>
      </div>
    </nav>
  );
}
