'use server';

import { db } from '@/lib/db';
import { productSchema } from '@/lib/definitions';
import { revalidatePath } from 'next/cache';

export const createProduct = async (dataRequest: any) => {
    const validatedFields = productSchema.safeParse(dataRequest);

    const { category_id, image_ids, variants, form_combines, ...r } = dataRequest;

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    if (image_ids?.length < 3) {
        return {
            error: 'Phải có ít nhất 3 ảnh',
        };
    }

    if (variants?.length > 0) {
        if (dataRequest.variants.some((item: any) => item.image === null)) {
            return { error: 'Ảnh của biến thể sản phẩm không được bỏ trống' };
        }
    }

    const product = await db.product.create({
        data: {
            ...r,
            category_id,
        },
    });

    await db.imagesForProducts.createMany({
        data: image_ids?.map((item: any) => ({
            image_id: item.id,
            product_id: product.id,
        })),
    });

    if (form_combines?.length > 0) {
        await db.formCombine.createMany({
            data: form_combines?.map((form: any) => ({
                date_id: form.date_id,
                title: form.title,
                values: form.values,
                isDone: form.isDone,
                product_id: product.id,
            })),
        });
    }

    if (variants?.length > 0) {
        await db.variant.createMany({
            data: variants?.map((variant: any) => ({
                image_id: variant.image.id,
                combinations: variant.combinations,
                price: variant.price,
                available: variant.available,
                product_id: product.id,
            })),
        });
    }

    return {
        product,
        success: 'Tạo sản phẩm thành công',
    };
};

export const updateProduct = async (id: string, dataRequest: any) => {
    const validatedFields = productSchema.safeParse(dataRequest);

    if (!id) {
        throw new Error('Không tìm thấy dữ liệu');
    }

    const { category_id, image_ids, variants, form_combines, ...r } = dataRequest;

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    if (image_ids?.length < 3) {
        return {
            error: 'Phải có ít nhất 3 ảnh',
        };
    }

    if (variants?.length > 0) {
        if (dataRequest.variants.some((item: any) => item.image === null)) {
            return { error: 'Ảnh của biến thể sản phẩm không được bỏ trống' };
        }
    }

    const product = await db.product.update({
        where: {
            id,
        },
        data: {
            ...r,
            category_id,
            form_combines: {
                deleteMany: {},
            },
            images: {
                deleteMany: {},
            },
            variants: {
                deleteMany: {},
            },
        },
    });

    await db.imagesForProducts.createMany({
        data: image_ids?.map((item: any) => ({
            image_id: item.id,
            product_id: product.id,
        })),
    });

    if (form_combines?.length > 0) {
        await db.formCombine.createMany({
            data: form_combines?.map((form: any) => ({
                date_id: form.date_id,
                title: form.title,
                values: form.values,
                isDone: form.isDone,
                product_id: product.id,
            })),
        });
    }

    if (variants?.length > 0) {
        await db.variant.createMany({
            data: variants?.map((variant: any) => ({
                image_id: variant.image.id,
                combinations: variant.combinations,
                price: variant.price,
                available: variant.available,
                product_id: product.id,
            })),
        });
    }

    revalidatePath(`${process.env.NEXT_REDIRECT_URL}/${product.id}`);

    return {
        product,
        success: 'Cập nhập sản phẩm thành công',
    };
};
