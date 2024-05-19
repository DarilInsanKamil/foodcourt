import { NextResponse } from "next/server";
import getPool from "@/app/(server)/db";

export async function GET(request, { params }) {
    const userId = params.menuId
    try {
        const pool = getPool()
        const { rows } = await pool.query(`SELECT * FROM menu_items WHERE id = ${userId}`)
        return new Response(JSON.stringify(rows), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify({ error: err }), { status: 500 })
    }
}