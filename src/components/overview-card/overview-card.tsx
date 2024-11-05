'use client';

import type { IconType } from 'react-icons';
import styles from './overview-card.module.scss';
import { GrGroup } from 'react-icons/gr';

type Props = {
    changeCurrency?: boolean;
    title: string;
    total: string | number;
    Icon?: IconType;
};

const OverviewCard = ({ title, total, changeCurrency, Icon }: Props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <h3>{title}</h3>
                {changeCurrency && (
                    <select defaultValue={'VND'}>
                        <option value="VND">VNĐ</option>
                        <option value="USD">USD</option>
                    </select>
                )}
                {Icon && <Icon />}
            </div>
            <h1>{total}</h1>
            <span>+20,1% so với tháng trước</span>
        </div>
    );
};

export default OverviewCard;
