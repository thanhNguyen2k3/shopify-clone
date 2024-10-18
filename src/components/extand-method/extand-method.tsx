import { MdKeyboardArrowRight } from 'react-icons/md';
import { HTMLAttributes, ReactNode, useState } from 'react';

import styles from './extand-method.module.scss';
import Drawer from '@mui/material/Drawer';
import styled from 'styled-components';

type Props = HTMLAttributes<HTMLDivElement> & {
    title?: string;
    icon?: ReactNode;
    heading?: string;
    extand?: boolean;
    body?: ReactNode;
};

const ExtandMethod = ({ title, heading, icon, extand, children, body, ...props }: Props) => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <h5 {...props}>{title}</h5>
                {extand && (
                    <button onClick={toggleDrawer(true)}>
                        <MdKeyboardArrowRight />
                    </button>
                )}
            </div>

            {children}

            <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
                <div className={styles.block_header}>
                    <h2>{heading}</h2>
                </div>
                <div className={styles.block_body}>{body}</div>
            </Drawer>
        </div>
    );
};

export default ExtandMethod;
