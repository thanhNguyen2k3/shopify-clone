import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });

        return user;
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            select: {
                email: true,
                id: true,
                image: true,
                name: true,
                role: true,
                username: true,
            },
        });

        return user;
    } catch (error) {
        return null;
    }
};
