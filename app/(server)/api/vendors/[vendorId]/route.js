import getPool from "@/app/(server)/db"
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const vendorId = params.vendorId
    try {
        const pool = getPool();
        console.log(vendorId)
        const { rows } = await pool.query(`SELECT * FROM vendors WHERE id = ${vendorId}`)
        pool.end();
        return NextResponse.json(rows, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PUT() {

}

export async function DELETE() {

}