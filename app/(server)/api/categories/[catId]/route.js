import getPool from "@/app/(server)/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const catid = params.catId
    try {
        const pool = getPool();
        const getCatId = await pool.query(`SELECT * FROM categories WHERE id = ${catid}`)
        pool.end();

        if (getCatId.rows.length === 0) {
            return NextResponse.json({ message: `categories with id ${catid} not found` }, { status: 404 })
        }

        return NextResponse.json(getCatId.rows[0], { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ err: err.message }, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    const catid = params.catId;
    const { name, description } = await req.json();
    try {
        const pool = getPool();
        if (!name || !description || !catid) {
            return NextResponse.json({ message: "all field are required" }, { status: 400 });
        }
        const queryUpdateCategories = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *';
        const value = [name, description, catid];
        const updateCategories = await pool.query(queryUpdateCategories, value);
        pool.end();
        return NextResponse.json({ update: updateCategories.rows[0], message: "Update categories success" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ err: error.message }, { status: 500 });
    }

}
export async function DELETE(req, { params }) {
    const catid = params.catId;
    try {
        const pool = getPool();
        if (!catid) {
            return NextResponse.json({ message: "items not found" }, { status: 400 });
        }
        const queryDeleteCategories = 'DELETE FROM categories WHERE id = $1 RETURNING *';
        const deleteCategories = await pool.query(queryDeleteCategories, [catid]);
        pool.end();

        if (deleteCategories.rows.length === 0) {
            return NextResponse.json({ message: "categories item not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "categories item delete successfully", deleteItem: deleteCategories.rows[0] }, { status: 200 })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ err: err.message }, { status: 500 })
    }
}
