import { NextResponse } from "next/server";
import getPool from "@/app/(server)/db";


export async function POST(req) {
    try {
        const { vendor, category, name, description, price, image, rating } = await req.json();
        const pool = getPool();

        const newMenu = await pool.query(
            'INSERT INTO menu_items (vendor_id, category_id, name, description, price, image, rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [vendor, category, name, description, price, image, rating]
        );
        pool.end();

        return NextResponse.json(
            { menu: newMenu.rows[0], message: "Menu add successfully" },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ err: err.message, message: "Something went wrong" }, { status: 500 });
    }
}



export async function GET(request) {
    try {
        const pool = getPool();
        const { rows } = await pool.query('SELECT * FROM menu_items');
        pool.end();
        return NextResponse.json(rows, { status: 200 })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ err: error.message }, { status: 500 })
    }
}