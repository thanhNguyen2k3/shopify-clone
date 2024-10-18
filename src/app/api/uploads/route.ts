import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

import { db } from '@/lib/db';

export const GET = async (req: NextRequest) => {
    try {
        const images = await db.image.findMany();

        if (images.length === 0) {
            return Response.json({ message: 'Phương tiện đang trống', data: [] }, { status: 200 });
        }

        const revalidate = req.nextUrl.searchParams.get('path') || '/';

        revalidatePath(revalidate);
        revalidateTag(revalidate);

        return Response.json({ message: 'Đã tìm thấy phương tiện đang có', data: images }, { status: 200 });
    } catch (error: any) {
        return Response.json({ message: error.message }, { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return Response.json({ message: 'Không tìm thấy phương tiện' }, { status: 201 });
    }

    const types = ['image/webp', 'image/jpg', 'image/png', 'image/jpeg', 'video/mp4'];
    if (!types.includes(file.type)) {
        return Response.json({ message: 'Phương tiện không hợp lệ' }, { status: 201 });
    }

    const duplucated = await db.image.findUnique({
        where: {
            name: file.name,
        },
    });

    if (duplucated) {
        return Response.json({ message: 'một số phương tiện đã được lưu trữ' }, { status: 200 });
    }

    const blob = await put(file.name, file.stream(), {
        access: 'public',
    });

    await db.image.createMany({
        data: {
            url: `${blob.url}`,
            name: file.name,
            size: file.size,
            type: file.type,
        },
    });

    revalidatePath('/videos/new');

    return Response.json(
        {
            message: 'Nạp file thành công',
            url: blob.url,
        },
        { status: 200 },
    );
};
