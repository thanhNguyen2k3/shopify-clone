'use client';
import { forwardRef } from 'react';

import { formatPrice } from '@/lib/format_price';
import styles from './order-card.module.scss';
import { ExtandOrder } from '@/types';
import React from 'react';

type Props = {
    data?: ExtandOrder | null;
    ref?: HTMLDivElement;
};

const OrderCard = forwardRef(({ data }: Props, ref: React.Ref<HTMLDivElement>) => {
    const reduceTotal = data?.product_variant_for_order?.reduce((total, value) => {
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

    return (
        <div>
            <div ref={ref} className={styles.payment_wrapper} style={{ zIndex: 9999999999999 }}>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.product_variant_for_order.map((row, index) => {
                            if (row.product_id && row.variant_id) {
                                return (
                                    <tr key={index}>
                                        <td style={{ padding: '6px 12px' }}>
                                            {row.product?.title} - {row?.variant?.combinations.join(' - ')}
                                        </td>
                                        <td style={{ padding: '6px 12px' }}>{row?.variant?.price}</td>
                                        <td style={{ padding: '6px 12px' }} align="center">
                                            {row?.quantity}
                                        </td>
                                        <td style={{ padding: '6px 12px' }}>
                                            {(row?.quantity * formatPrice(row.variant?.price!)).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            }

                            if (row.product_id && !row.variant_id) {
                                return (
                                    <tr key={index}>
                                        <td style={{ padding: '6px 12px' }}>{row.product?.title}</td>
                                        <td style={{ padding: '6px 12px' }}>{row?.variant?.price}</td>
                                        <td style={{ padding: '6px 12px' }} align="center">
                                            {row?.quantity}
                                        </td>
                                        <td style={{ padding: '6px 12px' }}>
                                            {(row?.quantity * formatPrice(row.variant?.price!)).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>

                <div className={styles.order}>
                    <h3>Thông tin khách hàng</h3>

                    <p className={styles.order_inform}>
                        <span>Tên khách hàng: </span>
                        <span>{data?.contact_information.name}</span>
                    </p>
                    <p className={styles.order_inform}>
                        <span>Số điện thoại: </span>
                        <span>{data?.contact_information.phone_number}</span>
                    </p>
                    <p className={styles.order_inform}>
                        <span>Địa chỉ: </span>
                        <span>{data?.contact_information.address}</span>
                    </p>
                </div>

                <div className={styles.order}>
                    <h3>Phương thức thanh toán</h3>

                    <p className={styles.order_inform}>
                        <span>Tổng hóa đơn: </span>
                        <span>{reduceTotal?.toLocaleString()}</span>
                    </p>
                    <p className={styles.order_inform}>
                        <span>Phương thức: </span>
                        <span>{data?.pay_method}</span>
                    </p>
                    <p className={styles.order_inform}>
                        <span>Mã giảm giá: </span>
                        <span>{data?.gift_card?.gift_card_code || 'Không có'}</span>
                    </p>
                    <p className={styles.order_inform}>
                        <span>Địa chỉ: </span>
                        <span>{data?.contact_information.address}</span>
                    </p>
                    <p className={styles.order_inform}>
                        <span>Ngày tạo: </span>
                        <span>
                            {new Date(data?.createdAt!)?.toLocaleTimeString()} -{' '}
                            {new Date(data?.createdAt!)?.toLocaleDateString()}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
