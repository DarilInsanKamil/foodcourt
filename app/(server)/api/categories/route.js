import { NextResponse } from "next/server";
import getPool from "../../db";

export async function GET() {
    try {
        const pool = getPool();
        const { rows } = await pool.query('SELECT * FROM categories')
        pool.end();
        return NextResponse.json(rows, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
export async function POST(request) {
    const { name, description } = await request.json();
    try {
        const pool = getPool();
        const newCategory = await pool.query('INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *', [name, description])
        pool.end();
        return NextResponse.json({ categories: newCategory.rows[0], message: "Categories add successfully" }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}