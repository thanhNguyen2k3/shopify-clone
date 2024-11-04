import { PER_PAGE } from '@/const';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);

    const viewQuery = searchParams.get('view')?.toString() ?? 'all';
    const orderQuery = searchParams.get('orderby')?.toString() ?? 'title';
    const arrangeQuery = searchParams.get('arrange')?.toString() ?? 'desc';
    const searchQuery = searchParams.get('search')?.toString() ?? '';
    const page = searchParams.get('page')?.toString() ?? '1';

    const currentPage = Math.max(Number(page), 1);

    const categories = await db.category.findMany({
        include: {
            image: true,
        },
        where: {
            activate: viewQuery === 'all' ? undefined : viewQuery,
            OR: [
                {
                    title: {
                        contains: searchQuery.replace(/(\w)\s+(\w)/g, '$1 <-> $2'),
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: {
            [orderQuery!]: arrangeQuery,
        },
        skip: (currentPage - 1) * PER_PAGE,
        take: PER_PAGE,
    });

    const count = await db.category.count({
        where: {
            activate: viewQuery === 'all' ? undefined : viewQuery,
            OR: [
                {
                    title: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                },
            ],
        },
    });

    if (categories.length === 0) {
        return NextResponse.json({ message: 'Không tìm thấy danh mục hiện có', data: categories });
    }

    return NextResponse.json({ message: 'Đã tìm thấy danh mục hiện có', data: categories, count });
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const { title, image_id } = body;

    if (title.length === 0) {
        return NextResponse.json({ error: 'Vui lòng ghi vào danh mục' }, { status: 200 });
    }

    const data = await db.category.create({
        data: {
            title,
            image_id,
        },
    });

    return NextResponse.json({ success: 'Tạo danh mục thành công', data }, { status: 200 });
};
