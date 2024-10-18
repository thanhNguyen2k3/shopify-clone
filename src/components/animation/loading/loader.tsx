import { HTMLAttributes } from 'react';
import styles from './loader.module.scss';

type Props = HTMLAttributes<HTMLDivElement> & {};

const Loader = ({ ...props }: Props) => {
    return (
        <div {...props} className={styles.wrapper}>
            <div className={styles.loader}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default Loader;
