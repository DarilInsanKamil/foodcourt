// Import necessary dependencies
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import getPool from '../../db';

export async function POST(req) {
    try {
        const { name, email, password, role } = await req.json();
        const pool = getPool();

        // Check if user with email already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    /* This block of code is checking if a user with the provided email already exists in the database.
    If `existingUser.rows.length` is greater than 0, it means that a user with the same email
    already exists. In that case, the code closes the database connection (`pool.end()`) and returns
    a JSON response using `NextResponse.json()` with a message indicating that the user with the
    email already exists along with a status code of 409 (Conflict). */
        if (existingUser.rows.length > 0) {
            pool.end();
            return NextResponse.json(
                { user: null, message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 10); // using 10 rounds of salt

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

export async function GET(request) {
    try {
        const pool = getPool();
        const { rows } = await pool.query('SELECT * FROM users');
        pool.end();
        return NextResponse.json({users: rows}, {status: 200})
    }
    catch {
        return new Response(JSON.stringify({ error: `An error occured` }), { status: 500 })
    }
}