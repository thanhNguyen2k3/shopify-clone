import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/schemas';
import { getUserByEmail, getUserById } from '@/actions/user';
import bcryptjs from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';

export default {
    trustHost: true,
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = loginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);

                    if (!user || !user.password) return null;

                    const passwordMatch = await bcryptjs.compare(password, user.password);

                    if (passwordMatch) return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const existingUser = await getUserById(user.id!);

            if (!existingUser) {
                return false;
            }

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
                session.user.username = token.username;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub!);

            if (!existingUser) return token;

            token.role = existingUser.role;
            token.username = existingUser.username;

            return token;
        },
    },
} satisfies NextAuthConfig;
