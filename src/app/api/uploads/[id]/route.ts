import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type ParamProps = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: ParamProps) => {
    if (!id) {
        return NextResponse.json({ message: 'Không thể tìm thấy dữ liệu ảnh' }, { status: 201 });
    }

    const data = await db.image.findFirst({
        where: {
            id,
        },
    });

    return NextResponse.json({ message: 'Phương tiện hiện tại', data: data }, { status: 200 });
};
