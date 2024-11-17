// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '../../../../prisma';
import { hash } from 'bcryptjs';

interface SignUpData {
    username: string;
    email: string;
    password: string;
}

export async function POST(request: Request) {
    try {
        // Parse and validate the JSON request body

        const data: SignUpData | null = await request.json();

        if (!data || !data.username || !data.email || !data.password) {
            return NextResponse.json({ message: 'Invalid request payload. All fields are required.' }, { status: 400 });
        }

        const { username, email, password } = data;

        console.log('Username:', username);

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        console.log('Hashed Password:', prisma.user);

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                name: username, // Mapping `username` to `name`
                email,
                password: hashedPassword
            }
        });

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
    } catch (error) {
        // console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}
