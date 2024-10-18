import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
    const categories = await db.category.findMany();

    if (categories.length === 0) {
        return NextResponse.json({ message: 'Không tìm thấy danh mục hiện có', data: categories });
    }

    return NextResponse.json({ message: 'Đã tìm thấy danh mục hiện có', data: categories });
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const { title, image_id } = body;

    if (title.length === 0) {
        return NextResponse.json({ message: 'Vui lòng ghi vào danh mục' }, { status: 200 });
    }

    const data = await db.category.create({
        data: {
            title,
            image: {
                connect: {
                    id: image_id,
                },
            },
        },
    });

    return NextResponse.json({ message: 'Tạo danh mục thành công', data }, { status: 200 });
};
