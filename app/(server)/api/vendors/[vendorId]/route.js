import getPool from "@/app/(server)/db"
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const vendorId = params.vendorId
    try {
        const pool = getPool();
        const rows = await pool.query(`SELECT * FROM vendors WHERE id = ${vendorId}`)
        pool.end();
        if (rows.rows.length === 0) {
            return NextResponse.json({ message: `vendors with id ${vendorId} not found` }, { status: 404 })
        }
        return NextResponse.json(rows.rows[0], { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PUT(req, { params }) {
    const vendorId = params.vendorId;
    const { name, description, logo } = await req.json();
    try {
        const pool = getPool();

        if (!name || !description || !logo) {
            return NextResponse.json({ message: "All field are required" }, { status: 400 })
        }

        const updateQueryVendor = `UPDATE vendors SET name = $1, description = $2, logo = $3 WHERE id = $4 RETURNING *`;

        const value = [name, description, logo, vendorId];
        const updateVendor = await pool.query(updateQueryVendor, value)
        pool.end();

        if (updateVendor.rows.length === 0) {
            return NextResponse.json({ message: "Vendor not found" }, { status: 404 })
        }

        return NextResponse.json({ update: updateVendor.rows[0], message: "Update Vendor success" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ err: err.message }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    const vendorId = params.vendorId;
    try {
        const pool = getPool();
        if (!vendorId) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 })
        }
        const deleteQueryVendor = 'DELETE FROM vendors WHERE id = $1 RETURNING *';
        const deleteVendor = await pool.query(deleteQueryVendor, [vendorId]);
        pool.end();
        if (deleteVendor.rows.length === 0) {
            return NextResponse.json({ message: "Vendor not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Vendors delete successfully", deleteItem: deleteVendor.rows[0] }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ err: error.message }, { status: 500 })
    }
}