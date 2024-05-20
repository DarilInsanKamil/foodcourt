import { NextResponse } from "next/server";
import getPool from "@/app/(server)/db";

export async function GET(request, { params }) {
    const menuId = params.menuId
    try {
        const pool = getPool()
        if (!menuId) {
            return NextResponse.json({ message: `menu items with id = ${menuId} not found` }, { status: 400 })
        }
        const { rows } = await pool.query(`SELECT * FROM menu_items WHERE id = $1`, [menuId])
        if (rows.length === 0) {
            return NextResponse.json({ message: `Menu item with id = ${menuId} not found` }, { status: 404 });
        }
        return NextResponse.json(rows, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ err: error.message }, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    const menuId = params.menuId;
    const { category_id, name, description, price, image } = await req.json();
    try {
        const pool = getPool();
        if (!menuId || !category_id || !name || !description || !price || !image) {
            return NextResponse.json({ message: "All field are required" }, { status: 400 })
        }

        const updateQueryMenu = `UPDATE menu_items SET category_id = $1, name = $2, description = $3, price = $4, image = $5 WHERE id = $6 RETURNING *`;

        const value = [category_id, name, description, price, image, menuId];

        const updateMenu = await pool.query(updateQueryMenu, value);
        pool.end();

        if (updateMenu.rows.length === 0) {
            return NextResponse.json({ message: "Menu item not found" }, { status: 404 })
        }

        return NextResponse.json({ update: updateMenu.rows[0], message: "Update menu success" }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ err: error.message }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    const menuId = params.menuId;
    try {
        const pool = getPool();
        if (!menuId) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 })
        }

        const delteQueryMenu = 'DELETE FROM menu_items WHERE id = $1 RETURNING *'
        const deleteMenu = await pool.query(delteQueryMenu, [menuId]);
        pool.end();

        if (deleteMenu.rows.length === 0) {
            return NextResponse.json({ message: "Menu item not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Menu item delete successfully", deleteItem: deleteMenu.rows[0] }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ err: err.message }, { status: 500 })
    }
}