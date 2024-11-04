import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type ParamsProps = {
    params: {
        id: string;
    };
};

export const GET = async (req: NextRequest, { params: { id } }: ParamsProps) => {
    if (!id) {
        return NextResponse.json({ message: 'không tìm thấy danh mục' }, { status: 200 });
    }

    const data = await db.category.findFirst({
        where: {
            id,
        },
    });

    return NextResponse.json(
        {
            data,
        },
        { status: 200 },
    );
};

export const PUT = async (req: NextRequest, { params: { id } }: ParamsProps) => {
    const { activate, title, image_id } = await req.json();

    if (!id) {
        return NextResponse.json({ error: 'không tìm thấy danh mục' }, { status: 400 });
    }

    await db.category.update({
        where: {
            id,
        },
        data: {
            title,
            activate,
            image_id,
        },
    });

    return NextResponse.json(
        {
            success: 'Cập nhật thành công',
        },
        { status: 200 },
    );
};
