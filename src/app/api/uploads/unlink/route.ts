import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { del } from '@vercel/blob';

import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
    const { ids } = await req.json();

    if (ids.length === 0) {
        return NextResponse.json({ message: 'Không tìm thấy phương tiện bạn muốn loại bỏ' }, { status: 201 });
    }

    await db.image.deleteMany({
        where: {
            name: {
                in: ids,
            },
        },
    });

    ids.map(async (file: string) => {
        await del(file);
    });

    return NextResponse.json({ message: 'Phương tiện đã được loại bỏ' }, { status: 200 });
};
