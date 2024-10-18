'use client';

import { IoMdArrowBack } from 'react-icons/io';
import styles from './back-button.module.scss';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();

    return (
        <div onClick={() => router.back()} className={styles.back_button}>
            <IoMdArrowBack size={20} />
        </div>
    );
};

export default BackButton;
