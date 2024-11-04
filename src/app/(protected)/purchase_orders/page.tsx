import React from 'react';
import PurchaseOrders from './purchase_orders';
import Heading from '@/components/haeding/heading';
import Button from '@/components/button/button';
import styles from './purchase_orders.module.scss';

const PurchaseOrdersPage = () => {
    return (
        <div>
            <div className={styles.wrapper_header}>
                <Heading title="Đơn hàng" />
                <Button activeType="link" to="products/new" variant="primary">
                    Thêm đơn hàng
                </Button>
            </div>
            <PurchaseOrders />
        </div>
    );
};

export default PurchaseOrdersPage;
