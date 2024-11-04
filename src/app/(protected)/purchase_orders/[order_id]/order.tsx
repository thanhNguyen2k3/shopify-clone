'use client';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Image from 'next/image';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import BackButton from '@/components/back-button/back-button';
import Heading from '@/components/haeding/heading';
import styles from '../purchase_orders.module.scss';
import { formatPrice } from '@/lib/format_price';
import { ExtandOrder } from '@/types';
import Button from '@/components/button/button';
import OrderCard from '@/components/order-card/order-card';

type Props = {
    data: ExtandOrder | null;
};

const Order = ({ data }: Props) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div>
            <Heading
                title={
                    <p>
                        Mã đơn hàng <span style={{ color: 'crimson' }}>{data?.id}</span> của{' '}
                        <span style={{ color: 'crimson' }}>{data?.contact_information?.name}</span>
                    </p>
                }
                status={data?.status}
                button={<BackButton />}
                titleStatus={data?.status}
            />

            {/* Render product */}

            <div className={styles.wrapper_new_form}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell align="right">Giá tiền</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Tổng giá</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.product_variant_for_order.map((row, index) => {
                                if (row.product_id && row.variant_id) {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Image
                                                    unoptimized
                                                    width={60}
                                                    height={60}
                                                    src={row?.variant?.image?.url!}
                                                    alt="image"
                                                />
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.product?.title} - {row?.variant?.combinations.join(' - ')}
                                            </TableCell>
                                            <TableCell align="right">{row?.variant?.price}</TableCell>
                                            <TableCell align="right">{row?.quantity}</TableCell>
                                            <TableCell align="right">
                                                {(row?.quantity * formatPrice(row.variant?.price!)).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                if (row.product_id && !row.variant_id) {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Image
                                                    unoptimized
                                                    width={60}
                                                    height={60}
                                                    src={row?.variant?.image?.url!}
                                                    alt="image"
                                                />
                                            </TableCell>
                                            <TableCell align="right">{row?.product?.title}</TableCell>
                                            <TableCell align="right">{row?.variant?.price}</TableCell>
                                            <TableCell align="right">{row?.quantity}</TableCell>
                                            <TableCell align="right">
                                                {(row?.quantity * formatPrice(row.variant?.price!)).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={styles.wrapper_form} style={{ minWidth: '51%', flex: '2 2 30rem' }}>
                    <div className={styles.wrapper}>
                        <h2>Thanh toán</h2>

                        <OrderCard ref={contentRef} data={data} />

                        <Button
                            sx={{ padding: '12px 0' }}
                            activeType="button"
                            variant="underline"
                            onClick={() => reactToPrintFn()}
                        >
                            In hóa đơn
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
