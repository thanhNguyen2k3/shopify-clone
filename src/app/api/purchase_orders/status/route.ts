import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { orders_status, order_ids } = await req.json();

        if (order_ids?.length === 0) {
            return NextResponse.json({ message: 'Không tìm thấy id đơn hàng' }, { status: 201 });
        }

        await db.order.updateMany({
            where: {
                id: {
                    in: order_ids,
                },
            },
            data: {
                status: orders_status,
            },
        });

        return NextResponse.json({ message: 'Cập nhật trạng thái thành công' }, { status: 200 });
    } catch (error) {
        return NextResponse.json('Server error');
    }
};
