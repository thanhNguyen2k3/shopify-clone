import { PER_PAGE } from '@/const';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/format_price';
import { ORDER_STATUS, VariantProductForOrder } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);

    const viewQuery = searchParams.get('view')?.toString() ?? 'all';
    const searchQuery = searchParams.get('search')?.toString() ?? '';
    const page = searchParams.get('page')?.toString() ?? '1';

    const currentPage = Math.max(Number(page), 1);

    try {
        const data = await db.order.findMany({
            include: {
                user: true,
                contact_information: true,
                reviews: {
                    include: {
                        user: true,
                    },
                },
                // products: true,
                gift_card: true,
                product_variant_for_order: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                image: true,
                            },
                        },
                        product: {
                            include: {
                                category: true,
                                images: {
                                    include: {
                                        image: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                status: viewQuery === 'all' ? undefined : (viewQuery as ORDER_STATUS),
                OR: [
                    {
                        id: {
                            startsWith: searchQuery,
                            mode: 'insensitive',
                        },
                    },
                    {
                        contact_information: {
                            name: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        contact_information: {
                            address: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            },

            skip: (currentPage - 1) * PER_PAGE,
            take: PER_PAGE,
        });

        const count = await db.order.count({
            where: {
                status: viewQuery === 'all' ? undefined : (viewQuery as ORDER_STATUS),
                OR: [
                    {
                        id: {
                            startsWith: searchQuery,
                            mode: 'insensitive',
                        },
                    },
                    {
                        contact_information: {
                            name: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        contact_information: {
                            address: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            },
        });

        if (!data) {
            return NextResponse.json({ data, message: 'Không tìm thấy đơn hàng nào.' }, { status: 200 });
        }

        return NextResponse.json({
            data,
            count: count,
        });
    } catch (error) {
        return NextResponse.json('Server error');
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { user_id, contact_information_id, pay_method, total, gift_card_id, product_variant_for_order } = body;

        const newOrder = await db.order.create({
            data: {
                user_id,
                pay_method,
                contact_information_id,
                gift_card_id,
                total,
            },
        });

        if (product_variant_for_order) {
            await db.variantProductForOrder.create({
                data: product_variant_for_order?.map((item: any) => ({
                    product: {
                        connect: {
                            id: item.product_id,
                        },
                    },
                    order_id: newOrder.id,
                    variant: {
                        connect: {
                            variant: {
                                id: item.variant_id,
                            },
                        },
                    },
                    quantity: item.quantity,
                })),
            });
        }

        const reduceTotal = product_variant_for_order?.reduce((total: any, value: any) => {
            if (value.product_id && value.variant_id) {
                const result = total + formatPrice(value.variant?.price!);

                return result;
            } else if (value.product_id && !value.variant_id) {
                const result = total + formatPrice(value.product?.price!);

                return result;
            } else {
                return 0;
            }
        }, 0);

        await db.order.update({
            where: {
                id: newOrder.id,
            },
            data: {
                total: reduceTotal,
            },
        });

        return NextResponse.json({ success: 'Đã tạo đơn hàng thành công' }, { status: 200 });
    } catch (error) {
        return NextResponse.json('Server error');
    }
};
