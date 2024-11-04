import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    params: {
        order_id: string;
    };
};

export const GET = async (req: NextRequest, { params: { order_id } }: Params) => {
    if (!order_id) {
        return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 400 });
    }

    try {
        const data = await db.order.findFirst({
            where: {
                id: order_id,
            },
            include: {
                contact_information: {
                    include: {
                        user: true,
                    },
                },
                gift_card: true,
                product_variant_for_order: {
                    include: {
                        product: {
                            include: {
                                images: {
                                    include: {
                                        image: true,
                                    },
                                },
                            },
                        },
                        variant: {
                            include: {
                                image: true,
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json('Server error');
    }
};

export const PUT = async (req: NextRequest, { params: { order_id } }: Params) => {
    if (!order_id) {
        return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 400 });
    }
    try {
        const body = await req.json();

        const { status } = body;

        await db.order.update({
            where: {
                id: order_id,
            },
            data: {
                status,
            },
        });

        return NextResponse.json({ success: 'Cập nhật trạng thái đơn hàng thành công' }, { status: 200 });
    } catch (error) {
        return NextResponse.json('Server error');
    }
};
