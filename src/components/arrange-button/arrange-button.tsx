'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa6';

import styles from './arrange-button.module.scss';
import Tooltip from '@mui/material/Tooltip';

type Props = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    tooltip?: string;
    arrange?: string;
};

const ArrangeButton = ({ children, tooltip, arrange, ...props }: Props) => {
    return (
        <div {...props} className={styles.wrapper}>
            <Tooltip title={tooltip} arrow placement="top">
                <div className={styles.box}>
                    {children}
                    <div className={styles.arrow}>
                        <FaAngleUp className={styles.active} />
                        <FaAngleDown className={styles.active} />
                    </div>
                </div>
            </Tooltip>
        </div>
    );
};

export default ArrangeButton;
