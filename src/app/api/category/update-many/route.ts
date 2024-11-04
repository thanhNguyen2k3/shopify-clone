import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    const { ids, activate } = await req.json();

    if (!ids) {
        return NextResponse.json(
            {
                error: 'Không tìm thấy ID',
            },
            { status: 400 },
        );
    }

    await db.category.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            activate,
        },
    });

    return NextResponse.json(
        {
            success: 'Cập nhật thành công',
        },
        { status: 200 },
    );
};
