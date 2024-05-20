import { NextResponse } from "next/server";
import getPool from "../../db";

export async function GET() {
    try {
        const pool = getPool();
        const { rows } = await pool.query('SELECT * FROM vendors')
        pool.end();
        return NextResponse.json(rows, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: err.message }, { status: 500 })
    }
}

export async function POST(req) {
    const { name, description, logo } = await req.json();
    try {
        const pool = getPool();
        if (!name || !description || !logo) {
            return NextResponse.json({ message: "All field are required" }, { status: 400 });
        }
        const queryAddVendor = 'INSERT INTO vendors (name, description, logo) VALUES ($1, $2, $3) RETURNING *';
        const value = [name, description, logo];
        const addNewVendor = await pool.query(queryAddVendor, value);
        pool.end();
        return NextResponse.json(addNewVendor.rows[0], { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ err: error.messaage }, { status: 500 });
    }
}
