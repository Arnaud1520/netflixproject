// src/app/api/categories/route.js
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors du GET des catégories :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  const data = await request.json();
  try {
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [data.name]);

    const newCategory = {
      id: result.insertId,
      name: data.name,
    };

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 });
  }
}
