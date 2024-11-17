import { PrismaAdapter } from '@auth/prisma-adapter';

import { saltAndHashPassword } from './lib/helper';
import { prisma as db } from './prisma';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    providers: [
        Github({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'email@example.com'
                },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }

                const email = credentials.email as string;
                const hash = saltAndHashPassword(credentials.password);

                let user: any = await db.user.findUnique({
                    where: {
                        email
                    }
                });

                console.log('user', hash);

                if (!user) {
                    user = await db.user.create({
                        data: {
                            email,
                            password: hash
                        }
                    });
                } else {
                    const isMatch = await bcrypt.compare(credentials.password as string, user.password);

                    console.log('ismatcheds', isMatch);
                    if (!isMatch) {
                        throw new Error('Incorrect password.');
                    }
                }

                return user;
            }
        })
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            console.log('url', url);
            console.log('baseUrl', baseUrl);
            // Redirect to the homepage after successful login
            return url === baseUrl || url === `${baseUrl}/login` ? `${baseUrl}/` : url;
        }
    },
    pages: {
        signIn: '/login'
    }
});
