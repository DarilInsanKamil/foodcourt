import getPool from "@/app/(server)/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const catid = params.catId
    try {
        const pool = getPool();
        const getCatId = await pool.query(`SELECT * FROM categories WHERE id = ${catid}`)
        pool.end();
        return NextResponse.json(getCatId.rows[0], { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ err: err.message }, { status: 500 })
    }
}

export async function PUT () {
    
}
export async function DELETE () {

}
