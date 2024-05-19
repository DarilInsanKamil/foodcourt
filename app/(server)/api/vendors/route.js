import { NextResponse } from "next/server";
import getPool from "../../db";

export async function GET () {
    try{
        const pool = getPool();
        const {rows} = await pool.query('SELECT * FROM vendors')
        pool.end();
        return NextResponse.json(rows, {status: 200})
    } catch (err) {
        console.log(err)
        return NextResponse.json({err: err.message}, {status: 500})
    }
}

