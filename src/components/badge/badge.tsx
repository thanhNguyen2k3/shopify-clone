import { HTMLAttributes } from 'react';
import { ORDER_STATUS } from '@prisma/client';

import styles from './badge.module.scss';

type Props = HTMLAttributes<HTMLSpanElement> & {
    status?: string;
};

const BadgeCustom = ({ title, status, ...props }: Props) => {
    return (
        <div className={styles.wrapper}>
            {status === 'active' && (
                <span {...props} className={styles.active}>
                    {title}
                </span>
            )}
            {status === 'inActive' && (
                <span {...props} className={styles.in_active}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.AWAITING && (
                <span {...props} className={styles.in_active}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.CONFIRMED && (
                <span {...props} className={styles.in_active}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.SHIPPING && (
                <span {...props} className={styles.in_active}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.SHIPPED && (
                <span {...props} className={styles.shipped}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.NEED_EVALUATION && (
                <span {...props} className={styles.in_active}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.RETURN && (
                <span {...props} className={styles.return}>
                    {title}
                </span>
            )}
            {status === ORDER_STATUS.CANCELLED && (
                <span {...props} className={styles.cancelled}>
                    {title}
                </span>
            )}
        </div>
    );
};

export default BadgeCustom;
