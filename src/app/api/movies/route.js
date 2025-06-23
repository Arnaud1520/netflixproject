import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - récupérer tous les films avec leurs catégories
export async function GET(req) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get('category');

  let query = `
    SELECT m.*, c.id AS category_id, c.name AS category_name
    FROM movies m
    LEFT JOIN movie_category mc ON m.id = mc.movie_id
    LEFT JOIN categories c ON c.id = mc.category_id
  `;
  let params = [];

  if (categoryId) {
    query += ' WHERE c.id = ?';
    params.push(categoryId);
  }

  try {
    const [rows] = await db.query(query, params);

    // Regrouper les catégories par film
    const movieMap = new Map();

    for (const row of rows) {
      if (!movieMap.has(row.id)) {
        movieMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          release_year: row.release_year,
          rating: row.rating,
          poster_url: row.poster_url,
          trailer_url: row.trailer_url,
          categories: [],
        });
      }

      if (row.category_id) {
        movieMap.get(row.id).categories.push({
          id: row.category_id,
          name: row.category_name,
        });
      }
    }

    const movies = Array.from(movieMap.values());
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Erreur GET /movies:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - créer un nouveau film
export async function POST(req) {
  const { title, description, release_year, rating, poster_url, trailer_url, category_id } = await req.json();

  try {
    const [result] = await db.query(
      'INSERT INTO movies (title, description, release_year, rating, poster_url, trailer_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, release_year, rating, poster_url, trailer_url]
    );

    const movieId = result.insertId;

    // Lier le film à sa catégorie
    if (category_id) {
      await db.query('INSERT INTO movie_category (movie_id, category_id) VALUES (?, ?)', [movieId, category_id]);
    }

    return NextResponse.json({ message: 'Film créé', movieId }, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /movies:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
