import { NextResponse } from "next/server";
import getPool from "../../db";
import { compare } from "bcrypt";

export async function POST(req) {
    try {
        const pool = getPool();
        const { email, password } = await req.json();

        const queryCheck = `
        SELECT * FROM users 
            WHERE email = $1
        `
        
        const existingUser = await pool.query(queryCheck, [email]);

        if (existingUser.rows.length === 0) {
            return NextResponse.json({ user: "user not found" }, { status: 404 })
        }

        const user = existingUser.rows[0]

        const passwordMatch = await compare(password, user.password)
        if (!passwordMatch) {
            return NextResponse.json({ message: "incorrect password" }, { status: 401 })
        }

        return NextResponse.json(user, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ err: err.message, message: "Something went wrong" }, { status: 500 });
    }
}