import { Dispatch, ReactNode, SetStateAction } from 'react';
import { IoMdClose } from 'react-icons/io';

import styles from './modal.module.scss';
import Button from '../button/button';
import AnimationModal from '../animation/modal/animation-modal';

type Props = {
    children?: ReactNode;
    title?: string;
    body?: string;
    footer?: string;
    modal?: boolean;
    setModal?: Dispatch<SetStateAction<boolean>>;
};

const Modal = ({ body, footer, title, modal, setModal }: Props) => {
    const handleHideModal = () => {
        setModal!(false);
    };

    return (
        <AnimationModal isState={modal} setIsState={setModal}>
            <div className={styles.modal_box}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                    <Button
                        onClick={handleHideModal}
                        activeType="button"
                        icon={IoMdClose}
                        sx={{ columnGap: 0, width: 28, height: 28 }}
                        variant="defaulted"
                        placement="left"
                        size={24}
                    />
                </div>
                <div className={styles.body}>{body}</div>
                <div className={styles.footer}>
                    <Button onClick={handleHideModal} activeType="button" variant="custom" sx={{ height: 28 }}>
                        Hủy
                    </Button>
                    <Button activeType="button" variant={'primary'} sx={{ height: 28 }}>
                        {footer}
                    </Button>
                </div>
            </div>
        </AnimationModal>
    );
};

export default Modal;
