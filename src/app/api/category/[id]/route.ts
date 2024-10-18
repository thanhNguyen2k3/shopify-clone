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
