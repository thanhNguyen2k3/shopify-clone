'use server';

import { db } from '@/lib/db';
import { ORDER_STATUS } from '@prisma/client';

type GraphData = {
    name: string;
    total: number;
};

export const getTotalRevenue = async () => {
    const totalOrder = await db.order.findMany({
        where: {
            status: ORDER_STATUS.SHIPPED,
        },
        select: {
            total: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const totalRevenue = totalOrder.reduce((prev, cur) => {
        const totalForOrder = prev + cur.total;

        return totalForOrder;
    }, 0);

    return totalRevenue;
};

export const getTotalRevenueForMonth = async () => {
    const totalOrder = await db.order.findMany({
        where: {
            status: ORDER_STATUS.SHIPPED,
        },
        select: {
            total: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const totalRevenue = totalOrder.reduce((prev, cur) => {
        const totalForOrder = prev + cur.total;

        return totalForOrder;
    }, 0);

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of totalOrder) {
        const month = order.createdAt.getMonth();

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + totalRevenue;
    }

    const grahpData: GraphData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 },
    ];

    for (const month in monthlyRevenue) {
        grahpData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return grahpData;
};

export const getSubsciptions = async () => {
    const totalSupscriptions = await db.order.findMany({
        select: {
            contact_information_id: true,
        },
    });

    return totalSupscriptions.length;
};

export const getSales = async () => {
    const sales = await db.order.findMany({
        select: {
            product_variant_for_order: true,
        },
    });

    const totalSales = sales.reduce((prev, curr) => {
        const total = prev + curr.product_variant_for_order?.length;

        return total;
    }, 0);

    return totalSales;
};

export const getActiveProduct = async () => {
    const totalActiveProduct = await db.product.count({
        where: {
            activate: 'active',
        },
    });

    return totalActiveProduct;
};

export const getStatusOrder = async () => {
    const statusOrderSuccess = await db.order.count({
        where: {
            status: ORDER_STATUS.SHIPPED,
        },
    });

    const statusOrderCancelled = await db.order.count({
        where: {
            status: ORDER_STATUS.CANCELLED,
        },
    });

    const statusOrderReturn = await db.order.count({
        where: {
            status: ORDER_STATUS.RETURN,
        },
    });

    const currentStatus: { [key: number]: number } = {};

    const grahpDataStatus = [
        { name: 'Đơn hàng hoàn thành', total: 12 },
        { name: 'Đơn hàng bị hủy', total: 4 },
        { name: 'Đơn hàng trả lại', total: 6 },
    ];

    return grahpDataStatus;
};
