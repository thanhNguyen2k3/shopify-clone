import { db } from '@/lib/db';
import { productSchema } from '@/lib/definitions';
import { NextRequest, NextResponse } from 'next/server';

type ParamsProps = {
    params: {
        id: string;
    };
};

export const GET = async (req: NextRequest, { params: { id } }: ParamsProps) => {
    try {
        if (!id) {
            return NextResponse.json({ message: 'Không tìm thấy dữ liệu yêu cầu' }, { status: 201 });
        }

        const existingData = await db.product.findFirst({
            where: {
                id,
            },
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
        });

        if (!existingData) {
            return NextResponse.json({ message: 'Không tìm thấy dữ liệu' }, { status: 201 });
        }

        return NextResponse.json({ message: 'Đã tìm thấy dữ liệu hiện có', data: existingData }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
};

export const PUT = async (req: NextRequest, { params: { id } }: ParamsProps) => {
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

    if (!id) return NextResponse.json({ message: 'Không tìm thấy dữ liệu' }, { status: 400 });

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

    const data = await db.product.update({
        where: {
            id,
        },
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
            form_combines: {
                deleteMany: {},
            },
            images: {
                deleteMany: {},
            },
            variants: {
                deleteMany: {},
            },
            continue_selling,
            price,
            core,
            supplies,
        },
    });

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
            message: 'Cập nhật sản phẩm thành công',
            data,
        },
        { status: 200 },
    );
};
