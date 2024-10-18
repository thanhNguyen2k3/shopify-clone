'use server';

import { z } from 'zod';
import bcryptjs from 'bcryptjs';

import { loginSchema, registerSchema } from '@/schemas';
import { db } from '@/lib/db';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';

export const login = async (values: any) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: 'Không hợp lệ',
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { errors: 'Sai thông tin đăng nhập!' };
                default:
                    return { errors: 'Có vấn đề gì đó 😅!' };
            }
        }

        throw error;
    }
};

export const register = async (values: z.infer<typeof registerSchema>) => {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { username, email, password } = validatedFields.data;

    const isDuplucatedUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (!!isDuplucatedUser) {
        return {
            message: 'Tài khoản email đã tồn tại',
        };
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    await db.user.create({
        data: {
            email,
            username,
            password: hashPassword,
        },
    });

    redirect('/login');
};
