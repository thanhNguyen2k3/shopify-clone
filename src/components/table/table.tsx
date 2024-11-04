'use client';

import { TableRows } from '@/types';
import styles from './table.module.scss';
import Loader from '../animation/loading/loader';

type Props = {
    rows: TableRows[];
    columns: any[];
    isLoading?: boolean;
};

const Table = ({ rows, columns, isLoading }: Props) => {
    return (
        <div className={styles.table_wrapper}>
            <table cellSpacing={0} cellPadding={0} className={styles.table}>
                <thead className={styles.table_head}>
                    <tr>
                        {rows.map((row) => (
                            <th key={row.id}>{row.label}</th>
                        ))}
                    </tr>
                </thead>

                <tbody className={styles.table_body}>
                    {isLoading && (
                        <tr>
                            <td>
                                <Loader style={{ position: 'absolute' }} />
                            </td>
                        </tr>
                    )}
                    {columns?.length === 0 ? (
                        <tr className={styles.no_rows}>
                            <td>Chưa có sản phẩm nào 😪</td>
                        </tr>
                    ) : (
                        columns?.map((item) => {
                            return item;
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
