import React, { HTMLAttributes } from 'react';

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
        </div>
    );
};

export default BadgeCustom;
