import { PER_PAGE } from '@/const';
import { db } from '@/lib/db';
import { productSchema } from '@/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);

    const viewQuery = searchParams.get('view')?.toString() ?? 'all';
    const orderQuery = searchParams.get('orderby')?.toString() ?? 'title';
    const arrangeQuery = searchParams.get('arrange')?.toString() ?? 'desc';
    const searchQuery = searchParams.get('search')?.toString() ?? '';
    const page = searchParams.get('page')?.toString() ?? '1';

    const currentPage = Math.max(Number(page), 1);

    try {
        const data = await db.product.findMany({
            include: {
                category: {
                    include: {
                        image: true,
                    },
                },
                images: {
                    include: {
                        image: true,
                    },
                },
                variants: {
                    include: {
                        image: true,
                    },
                },
                form_combines: true,
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

        const count = await db.product.count({
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

        if (data.length === 0) {
            return NextResponse.json({ message: 'Dữ liệu trống', data }, { status: 201 });
        }

        return NextResponse.json({ message: 'Dữ liệu hiện có', data, count: count }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const {
        title,
        description,
        category_id,
        price,
        core,
        quantity_tracking,
        continue_selling,
        inventory,
        region_of_origin,
        activate,
        product_type,
        supplies,
        tags,
        image_ids,
        variants,
        form_combines,
    } = body;

    const validatedFields = productSchema.safeParse({
        title,
        category_id,
    });

    if (!validatedFields.success) {
        return NextResponse.json(
            {
                errors: validatedFields.error.flatten().fieldErrors,
            },
            { status: 400 },
        );
    }

    const data = await db.product.create({
        data: {
            title,
            description,
            inventory,
            product_type,
            quantity_tracking,
            region_of_origin,
            tags,
            activate,
            category: {
                connect: {
                    id: category_id,
                },
            },
            continue_selling,
            price,
            core,
            supplies,
        },
    });

    if (image_ids?.length < 3) {
        return NextResponse.json(
            {
                message: 'Vui lòng thêm ít nhất 3 ảnh',
            },
            { status: 400 },
        );
    }

    if (image_ids) {
        await db.imagesForProducts.createMany({
            data: image_ids.map((item: any) => ({
                image_id: item.id,
                product_id: data.id,
            })),
        });
    }

    if (form_combines) {
        await db.formCombine.createMany({
            data: form_combines.map((form: any) => ({
                date_id: form.date_id,
                title: form.title,
                values: form.values,
                isDone: form.isDone,
                product_id: data.id,
            })),
        });
    }

    if (variants) {
        await db.variant.createMany({
            data: variants.map((variant: any) => ({
                image_id: variant.image.id,
                combinations: variant.combinations,
                price: variant.price,
                available: variant.available,
                product_id: data.id,
            })),
        });
    }

    return NextResponse.json(
        {
            message: 'Tạo sản phẩm thành công',
            data,
        },
        { status: 200 },
    );
};
