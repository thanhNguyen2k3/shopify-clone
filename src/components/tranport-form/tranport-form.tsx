'use client';

import { IoIosClose } from 'react-icons/io';

import styles from './tranport-form.module.scss';
import { useState } from 'react';

type Props = {};

const TranportForm = (props: Props) => {
    const [modal, setModal] = useState<boolean>(false);

    const handleClose = () => {
        setModal(false);
    };

    const hanldeShow = () => {
        setModal(true);
    };

    const handleEventClose = (e: any) => {
        e.stopPropagation();

        setModal(false);
    };

    return (
        <div>
            <div className={styles.wrapper} onClick={handleEventClose}>
                <div className={styles.wrapper_inner}>
                    <div className={styles.body}>
                        <div style={{ minHeight: 300 }}>
                            <div className={styles.address}>
                                <div className={styles.check}></div>
                                <div className={styles.info}>
                                    <h4>Thanh Nguyễn | 0962616613</h4>
                                    <p>
                                        Số nhà 5 ngách 1 Ngõ 46 Đường Xuân Phương Phường Phương Canh, Quận Nam Từ Liêm,
                                        Hà Nội
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranportForm;
