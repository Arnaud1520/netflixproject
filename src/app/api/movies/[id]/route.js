import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { id } = params;
    const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);

    if (rows.length === 0) {
        return NextResponse.json({ message: 'Film introuvable' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { title, description, release_year, rating, poster_url, trailer_url } = await req.json();

    await db.query(
        'UPDATE movies SET title=?, description=?, release_year=?, rating=?, poster_url=?, trailer_url=? WHERE id=?',
        [title, description, release_year, rating, poster_url, trailer_url, id]
    );

    return NextResponse.json({ message: 'Film mis à jour' });
}

export async function DELETE(req, { params }) {
    const { id } = params;

    await db.query('DELETE FROM movies WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Film supprimé' });
}
