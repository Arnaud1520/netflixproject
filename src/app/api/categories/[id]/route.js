// src/app/api/categories/[id]/route.js
import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = parseInt(params.id);

  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const id = parseInt(params.id);
  const data = await request.json();

  try {
    await db.query('UPDATE categories SET name = ? WHERE id = ?', [data.name, id]);

    return NextResponse.json({ message: 'Catégorie mise à jour' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);

  try {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
