import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import getPool from '../../db';

export async function POST(req) {
    try {
        const { name, email, password, role } = await req.json();
        const pool = getPool();

        // Check if user with email already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            pool.end();
            return NextResponse.json(
                { user: null, message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Insert new user into database
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, role]
        );

        pool.end();
        return NextResponse.json(
            { user: newUser.rows[0], message: "User created successfully" },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ err: err.message, message: "Something went wrong" }, { status: 500 });
    }
}

